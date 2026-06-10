import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { PostgresImagesRepository } from '../images/postgres-images.repository';

@Injectable()
export class CarsService {
  constructor(
    @Inject(CarsRepository) private readonly carsRepository: CarsRepository,
    @Inject(PostgresImagesRepository)
    private readonly postgresImagesRepository: PostgresImagesRepository,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(createCarDto: CreateCarDto, files?: Express.Multer.File[]) {
    return await this.prisma.$transaction(async (tx) => {
      const { id } = await this.carsRepository.create(createCarDto, tx);
      if (!id) {
        throw new InternalServerErrorException('Car creation failed');
      }
      if (files && files.length > 0) {
        await this.postgresImagesRepository.createImages(id, files, tx);
      }
      return this.carsRepository.findOne(id);
    });
  }

  findAll() {
    return this.carsRepository.findAll();
  }

  async findOne(id: string) {
    const car = await this.carsRepository.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    files?: Express.Multer.File[],
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const { deletedImagesIds, ...restData } = updateCarDto;
      const car = await this.carsRepository.update(id, restData, tx);
      if (!car) {
        throw new BadRequestException(
          'Failed to update car due to database conflict or invalid data',
        );
      }
      if (deletedImagesIds && deletedImagesIds.length > 0) {
        await this.postgresImagesRepository.deleteImages(id, tx);
      }
      if (files && files.length > 0) {
        await this.postgresImagesRepository.createImages(id, files, tx);
      }

      return this.carsRepository.findOne(id, tx);
    });
  }

  async remove(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      const car = await this.carsRepository.remove(id, tx);
      if (!car) {
        throw new NotFoundException(`Car with ID ${id} not found`);
      }
      if (car?.images?.length > 0) {
        await this.postgresImagesRepository.deleteImages(id, tx);
      }
      return car;
    });
  }
  // v8 ignore start
  async removeAll() {
    return await this.carsRepository.removeAll();
  }

  async createMany(cars: CreateCarDto[]) {
    return await this.carsRepository.createMany(cars);
  }
  // v8 ignore end
}
