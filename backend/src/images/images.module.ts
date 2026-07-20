import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images.service';
import { BucketType } from '../storage/s3.service';
import { PostgresImagesRepository } from '../images/postgres-images.repository';
import { StorageModule } from '../storage/storage.module';
import { ImagesRepository } from './images.repository';

@Module({
  imports: [ConfigModule, StorageModule.register(BucketType.CARS)],
  providers: [
    ImagesService,
    PostgresImagesRepository,
    {
      provide: ImagesRepository,
      useClass: PostgresImagesRepository,
    },
  ],
  exports: [ImagesService, ImagesRepository],
})
export class ImagesModule {}
