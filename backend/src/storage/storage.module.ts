import { Module, DynamicModule } from '@nestjs/common';
import { S3Service, BucketType } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import { BUCKET_CONFIG } from './s3.config';

@Module({})
export class StorageModule {
  static register(type: BucketType): DynamicModule {
    return {
      module: StorageModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'S3_CONFIG',
          useValue: BUCKET_CONFIG[type],
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
