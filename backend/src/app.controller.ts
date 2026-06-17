import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return {
      status: 'online',
      message: 'Luxury Car Rental API is running',
      version: '1.0.0',
    };
  }
}
