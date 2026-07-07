import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from 'prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { UsersModule } from './users/users.module';
import { TestingModule } from '../test/testing/testing.module';

@Module({
  imports: [
    CarsModule,
    StorageModule,
    PrismaModule,
    AuthModule.forRoot({ auth }),
    UsersModule,
    TestingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
