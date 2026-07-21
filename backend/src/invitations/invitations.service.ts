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
import { AcceptInvitationDto } from '@/src/invitations/dto/accept-invitation.dto';
import { auth } from '@/lib/auth';
import { CreateInvitationDto } from '@/src/invitations/dto/create-invitation.dto';
import { GetInvitationsDto } from '@/src/invitations/dto/get-invitations.dto';
import { type User } from 'better-auth';
import { PermissionGuardService } from '../shared/permissions-guard.service';

@Injectable()
export class InvitationsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PermissionGuardService)
    private readonly permissionGuard: PermissionGuardService,
  ) {}

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

    await publishEvent('invitation_sent', {
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
    if (invitation.status === 'ACCEPTED') {
      return { valid: false, reason: 'already_accepted' };
    }
    if (invitation.status === 'REVOKED') {
      return { valid: false, reason: 'revoked' };
    }
    if (invitation.expiresAt < new Date()) {
      return { valid: false, reason: 'expired' };
    }

    return { valid: true, email: invitation.email };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
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

  async getInvitations(dto: GetInvitationsDto) {
    const { limit, page, sortBy, search } = dto;
    const skip = (page - 1) * limit;
    const orderBy = sortBy ? { [sortBy]: dto.sortDirection } : {};
    const where = search
      ? {
          email: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};
    const [rawInvitations, totalItems] = await Promise.all([
      this.prisma.invitation.findMany({
        where,
        omit: {
          token: true,
          invitedBy: true,
        },
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
      this.prisma.invitation.count({ where }),
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = page < totalPages;

    const invitations = rawInvitations.map(({ user, ...invitation }) => ({
      ...invitation,
      invitedBy: user?.email || '',
    }));

    return { invitations, totalItems, limit, page, totalPages, hasMore };
  }

  async resendInvitation(id: string, user: User) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException(
        'Cannot resend an already accepted invitation',
      );
    }

    if (invitation.role === 'admin') {
      await this.permissionGuard.assertPermission(
        user.id,
        { invitation: ['resend-admin'] },
        'You don`t have permissions to resend invitation for admin',
      );
    }

    const newToken = randomBytes(32).toString('hex');

    const expiresAt = new Date(
      Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const updatedInvitation = await this.prisma.invitation.update({
      where: { id },
      data: {
        token: newToken,
        expiresAt,
        status: 'PENDING',
      },
    });

    await publishEvent('invitation_resent', {
      email: invitation.email,
      context: {
        invitationDeadline: expiresAt.toDateString(),
        registrationUrl: `${process.env.APP_URL}/auth?token=${newToken}`,
      },
    });

    return {
      message: 'Invitation successfully resent',
      data: updatedInvitation,
    };
  }

  async revokeInvitation(id: string, user: User) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException(
        'Cannot revoke an already accepted invitation',
      );
    }

    if (invitation.status === 'REVOKED') {
      throw new BadRequestException('Invitation is already revoked');
    }

    if (invitation.role === 'admin') {
      await this.permissionGuard.assertPermission(
        user.id,
        { invitation: ['revoke-admin'] },
        'You don`t have permissions to revoke invitation for admin',
      );
    }

    const updatedInvitation = await this.prisma.invitation.update({
      where: { id },
      data: {
        status: 'REVOKED',
        token: null,
      },
    });

    await publishEvent('invitation_revoked', {
      email: invitation.email,
    });

    return {
      message: 'Invitation has been revoked',
      data: updatedInvitation,
    };
  }
}
