import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CarsModule } from './cars/cars.module';
import { ImagesModule } from './images/images.module';
import { S3Service } from './images/s3.service';

@Module({
  imports: [CarsModule, ImagesModule],
  controllers: [AppController],
  providers: [S3Service],
})
export class AppModule {}
