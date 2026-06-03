import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [CarsModule, StorageModule],
  controllers: [AppController],
})
export class AppModule {}
