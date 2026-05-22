import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [CarsModule],
  controllers: [AppController],
})
export class AppModule {}
