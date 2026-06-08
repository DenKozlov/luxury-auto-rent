import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarsRepository } from './cars.repository';
import { CarQueryDto } from './dto/car-pagination.dto';

@Injectable()
export class CarsService {
  constructor(
    @Inject(CarsRepository) private readonly carsRepository: CarsRepository,
  ) {}

  create(createCarDto: CreateCarDto, files?: Express.Multer.File[]) {
    return this.carsRepository.create(createCarDto, files);
  }

  async findAll(query: CarQueryDto) {
    return this.carsRepository.findAll(query);
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

  async getFilters() {
    return await this.carsRepository.getFilters();
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
