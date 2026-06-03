import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarsRepository } from './cars.repository';

@Injectable()
export class CarsService {
  constructor(
    @Inject(CarsRepository) private readonly carsRepository: CarsRepository,
  ) {}

  create(createCarDto: CreateCarDto, files?: Express.Multer.File[]) {
    return this.carsRepository.create(createCarDto, files);
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

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.carsRepository.update(id, updateCarDto);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async remove(id: string) {
    const car = await this.carsRepository.remove(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
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
