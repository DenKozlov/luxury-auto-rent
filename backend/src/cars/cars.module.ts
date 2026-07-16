import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { PostgresCarsRepository } from './postgres-cars.repository';
import { ImagesRepository } from '../images/images.repository';
import { PostgresImagesRepository } from '../images/postgres-images.repository';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [CarsController],
  providers: [
    CarsService,
    {
      provide: CarsRepository,
      useClass: PostgresCarsRepository,
    },
    PostgresImagesRepository,
    {
      provide: ImagesRepository,
      useExisting: PostgresImagesRepository,
    },
  ],
})
export class CarsModule {}
