import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarsRepository } from './cars.repository';

@Injectable()
export class CarsService {
  constructor(
    @Inject(CarsRepository) private readonly carsRepository: CarsRepository,
  ) {}

  create(createCarDto: CreateCarDto) {
    return this.carsRepository.create(createCarDto);
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

  async removeAll() {
    return await this.carsRepository.removeAll();
  }
}
