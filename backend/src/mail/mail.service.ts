import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EmailSubject, MailContext, SendEamilParams } from '../../common/types';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly templateCache = new Map<
    string,
    handlebars.TemplateDelegate
  >();

  private renderTemplate<T extends MailContext>(
    templateName: EmailSubject,
    context?: T,
  ): string {
    if (!this.templateCache.has(templateName)) {
      this.loadTemplateToCache(templateName);
    }

    const template = this.templateCache.get(templateName);

    if (!template) {
      throw new Error(`Template ${templateName} could not be loaded.`);
    }

    return template(context);
  }

  private loadTemplateToCache(templateName: EmailSubject): void {
    const filePath = join(
      process.cwd(),
      'src/mail/templates',
      `${templateName}.hbs`,
    );
    const source = readFileSync(filePath, 'utf8');

    this.templateCache.set(templateName, handlebars.compile(source));
  }

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail<T extends MailContext>({
    to,
    subject,
    templateName,
    context,
  }: SendEamilParams<T>): Promise<SentMessageInfo> {
    try {
      const html = this.renderTemplate(templateName, context);

      const info = await this.transporter.sendMail({
        from: '"Zenith - Luxury Auto Rent" <no-reply@luxury.com>',
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      throw error;
    }
  }
}
