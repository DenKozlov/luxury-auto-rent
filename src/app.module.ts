import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from 'prisma.module';

@Module({
  imports: [CarsModule, StorageModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
