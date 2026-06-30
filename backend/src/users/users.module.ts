import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ImagesModule } from '../images/images.module';
import { StorageModule } from '../storage/storage.module';
import { BucketType } from '../storage/s3.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ImagesModule, StorageModule.register(BucketType.CARS)],
})
export class UsersModule {}
