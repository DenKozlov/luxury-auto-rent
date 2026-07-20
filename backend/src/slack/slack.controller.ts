import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(
    @Inject(SlackService) private readonly slackService: SlackService,
  ) {}

  @EventPattern('user_deactivated')
  async handleUserDeactivated(@Payload() data: { email: string }) {
    await this.slackService.sendNotification(
      '🚫 User Account Deactivated',
      `User *${data.email}* has been deactivated`,
    );
  }
}
