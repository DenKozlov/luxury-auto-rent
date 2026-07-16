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

  @EventPattern('user_invited')
  async handleUserInvited(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Invitation Notice',
      templateName: EmailSubjectEnum.Invitation,
      context: data.context,
    });
  }
}
