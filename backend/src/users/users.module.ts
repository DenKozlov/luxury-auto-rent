import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StorageModule } from '../storage/storage.module';
import { BucketType } from '../storage/s3.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [StorageModule.register(BucketType.USERS)],
})
export class UsersModule {}
