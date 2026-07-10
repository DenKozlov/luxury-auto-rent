import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { DeactivationContext } from '../common/types';

@Controller('mail')
export class MailController {
  constructor(@Inject(MailService) private readonly mailService: MailService) {}

  @EventPattern('user_deactivated')
  async handleUserDeactivated(
    @Payload() data: { email: string; context: DeactivationContext },
  ) {
    await this.mailService.sendMail(
      data.email,
      'Account Deactivation Notice',
      'deactivation',
      data.context,
    );
  }
}
