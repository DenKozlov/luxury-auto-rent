import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from 'prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { UsersModule } from './users/users.module';
import { TestingModule } from '../test/testing/testing.module';
import { MailModule } from './mail/mail.module';
import { SlackModule } from './slack/slack.module';
import { InvitationsModule } from './invitations/invitations.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';

@Module({
  imports: [
    CarsModule,
    StorageModule,
    PrismaModule,
    AuthModule.forRoot({ auth }),
    UsersModule,
    TestingModule,
    MailModule,
    SlackModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
