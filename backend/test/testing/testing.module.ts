import { Logger, Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
const isTestEnv = process.env.NODE_ENV === 'test';

if (isTestEnv) {
  Logger.warn(
    'TestingModule ENABLED — reset endpoint is live',
    'TestingModule',
  );
}

@Module({
  controllers: isTestEnv ? [TestingController] : [],
  providers: isTestEnv ? [TestingService] : [],
})
export class TestingModule {}
