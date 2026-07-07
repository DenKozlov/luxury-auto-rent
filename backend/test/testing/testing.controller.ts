import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { TestingService } from './testing.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('testing')
export class TestingController {
  constructor(@Inject(TestingService) private testingService: TestingService) {}

  @Post('reset')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  async reset() {
    if (process.env.NODE_ENV !== 'test') {
      throw new ForbiddenException(
        'CRITICAL: Reset allowed ONLY in test environment',
      );
    }
    return await this.testingService.resetTestDatabase();
  }
}
