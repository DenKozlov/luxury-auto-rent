import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images.service';
import { S3Service } from '../storage/s3.service';
import { PostgresImagesRepository } from '../images/postgres-images.repository';

@Module({
  imports: [ConfigModule],
  providers: [ImagesService, S3Service, PostgresImagesRepository],
  exports: [ImagesService, PostgresImagesRepository],
})
export class ImagesModule {}
