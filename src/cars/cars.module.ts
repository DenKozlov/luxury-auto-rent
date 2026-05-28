import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { PostgresCarsRepository } from './postgres-cars.repository';

@Module({
  controllers: [CarsController],
  providers: [
    {
      provide: 'CARS_SERVICE',
      useClass: CarsService,
    },
    PrismaService,
    {
      provide: CarsRepository,
      useClass: PostgresCarsRepository,
    },
  ],
})
export class CarsModule {}
