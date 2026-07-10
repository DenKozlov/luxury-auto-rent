import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async sendNotification(
    title: string,
    text: string,
    color: string = '#cccccc',
  ) {
    const webhookUrl =
      this.configService.get<string>('SLACK_WEBHOOK_URL') ?? '';

    const payload = {
      attachments: [
        {
          color: color,
          title: title,
          text: text,
          footer: 'ZenithNotifier Bot',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    try {
      await axios.post(webhookUrl, payload);
    } catch (e) {
      const err = e as Error;
      this.logger.error(`Failed to send message: ${err.message}`);
    }
  }
}
