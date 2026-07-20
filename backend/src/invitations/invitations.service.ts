import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { INVITATION_TTL_DAYS, InvitationStatus } from '@/common/constants';
import { randomBytes } from 'crypto';
import { publishEvent } from '@/lib/rabbit-connection';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { auth } from '@/lib/auth';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { type Request } from 'express';

@Injectable()
export class InvitationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async sendInvitation(dto: CreateInvitationDto, invitedByUserId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email is already exists');
    }

    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email: dto.email,
        status: InvitationStatus.Pending,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new BadRequestException(
        'Invitation to this email has already sent and still active.',
      );
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(
      Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        token,
        role: dto.role ?? 'user',
        invitedBy: invitedByUserId,
        expiresAt,
        status: InvitationStatus.Pending,
      },
    });

    await publishEvent('user_invited', {
      email: dto.email,
      context: {
        invitationDeadline: expiresAt.toDateString(),
        registrationUrl: `${process.env.APP_URL}/auth?token=${token}`,
      },
    });

    return {
      id: invitation.id,
      invitedBy: invitation.invitedBy,
    };
  }

  async validateInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return { valid: false, reason: 'not_found' };
    }
    if (invitation.status === InvitationStatus.Accepted) {
      return { valid: false, reason: 'already_accepted' };
    }
    if (invitation.status === InvitationStatus.Revoked) {
      return { valid: false, reason: 'revoked' };
    }
    if (invitation.expiresAt < new Date()) {
      return { valid: false, reason: 'expired' };
    }

    return { valid: true, email: invitation.email };
  }

  async acceptInvitation(dto: AcceptInvitationDto, req: Request) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation has not found');
    }
    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitaion is already used or revoked');
    }
    if (invitation.expiresAt < new Date()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Invitation is expired');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email: invitation.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'User with this email is already registered',
      );
    }

    const { headers, response } = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        password: dto.password,
        name: dto.name,
      },
      returnHeaders: true,
    });

    if (!response.user) {
      throw new BadRequestException('Failed to create user');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: response.user.id },
        data: { role: invitation.role },
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      }),
    ]);

    return { user: response.user, setCookie: headers.getSetCookie() };
  }
}
