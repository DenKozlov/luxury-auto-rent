import { RequirePermission } from '@/auth/decorators/require-permission.decorator';
import {
  Body,
  Get,
  Query,
  Controller,
  Post,
  Inject,
  Req,
  Res,
} from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { type Request, type Response } from 'express';

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

  //   @Get()
  //   @RequirePermission('invitation', 'list')
  //   async list() {
  //     return this.invitationsService.listPendingInvitations();
  //   }

  //   @Post(':id/resend')
  //   @RequirePermission('invitation', 'resend')
  //   async resend(@Param('id') id: string) {
  //     return this.invitationsService.resendInvitation(id);
  //   }

  //   @Post(':id/revoke')
  //   @RequirePermission('invitation', 'revoke')
  //   async revoke(@Param('id') id: string) {
  //     return this.invitationsService.revokeInvitation(id);
  //   }

  @Post('accept')
  @AllowAnonymous()
  async accept(
    @Body() dto: AcceptInvitationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.invitationsService.acceptInvitation(dto, req);

    if (result.setCookie?.length) {
      res.setHeader('Set-Cookie', result.setCookie);
    }

    return { success: true, user: result.user };
  }
}
