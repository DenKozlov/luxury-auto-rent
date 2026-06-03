import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images.service';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule],
  providers: [ImagesService, S3Service],
  exports: [ImagesService, S3Service],
})
export class ImagesModule {}
