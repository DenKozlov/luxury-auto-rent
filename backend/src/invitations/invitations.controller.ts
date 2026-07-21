import { RequirePermission } from '@/auth/decorators/require-permission.decorator';
import {
  Body,
  Get,
  Query,
  Controller,
  Post,
  Inject,
  Res,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { InvitationsService } from '@/src/invitations/invitations.service';
import { CreateInvitationDto } from '@/src/invitations/dto/create-invitation.dto';
import { AcceptInvitationDto } from '@/src/invitations/dto/accept-invitation.dto';
import { type Response } from 'express';
import { GetInvitationsDto } from '@/src/invitations/dto/get-invitations.dto';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { type User } from 'better-auth';

@Controller('invitations')
export class InvitationsController {
  constructor(
    @Inject(InvitationsService)
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post('/send')
  @RequirePermission('invitation', 'send')
  async create(
    @Body() dto: CreateInvitationDto,
    @Session() session: UserSession,
  ) {
    return await this.invitationsService.sendInvitation(dto, session.user.id);
  }

  @Get('/validate')
  @AllowAnonymous()
  async validate(@Query('token') token: string) {
    return await this.invitationsService.validateInvitation(token);
  }

  @Get()
  @RequirePermission('invitation', 'list')
  async get(
    @Query() rawDto: GetInvitationsDto,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const dto = {
      ...rawDto,
      page,
      limit,
    };
    return this.invitationsService.getInvitations(dto);
  }

  @Patch(':id/resend')
  @RequirePermission('invitation', 'resend')
  async resend(@Param('id') id: string, @CurrentUser() user: User) {
    return this.invitationsService.resendInvitation(id, user);
  }

  @Patch(':id/revoke')
  @RequirePermission('invitation', 'revoke')
  async revoke(@Param('id') id: string, @CurrentUser() user: User) {
    return this.invitationsService.revokeInvitation(id, user);
  }

  @Post('accept')
  @AllowAnonymous()
  async accept(
    @Body() dto: AcceptInvitationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.invitationsService.acceptInvitation(dto);

    if (result.setCookie?.length) {
      res.setHeader('Set-Cookie', result.setCookie);
    }

    return { success: true, user: result.user };
  }
}
