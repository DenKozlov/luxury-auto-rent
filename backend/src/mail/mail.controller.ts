import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { DeactivationContext } from '../../common/types';
import { EmailSubjectEnum } from '@/common/constants';

@Controller('mail')
export class MailController {
  constructor(@Inject(MailService) private readonly mailService: MailService) {}

  @EventPattern('user_deactivated')
  async handleUserDeactivated(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Account Deactivation Notice',
      templateName: EmailSubjectEnum.Deactivation,
      context: data.context,
    });
  }

  @EventPattern('user_reactivated')
  async handleUserReactivated(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Account Reactivation Notice',
      templateName: EmailSubjectEnum.Reactivation,
      context: data.context,
    });
  }

  @EventPattern('invitation_sent')
  async handleInvitationSend(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Invitation Notice',
      templateName: EmailSubjectEnum.Invitation,
      context: data.context,
    });
  }

  @EventPattern('invitation_resent')
  async handleInvitationResend(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Invitation Notice',
      templateName: EmailSubjectEnum.Resend,
      context: data.context,
    });
  }

  @EventPattern('invitation_revoked')
  async handleInvitationRevoked(@Payload() data: { email: string }) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Invitation Revoked',
      templateName: EmailSubjectEnum.Revoke,
    });
  }
}
