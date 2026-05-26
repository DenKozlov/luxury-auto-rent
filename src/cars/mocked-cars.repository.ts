import { Injectable, NotFoundException } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './car.interface';
import { MOCK_CARS } from './cars.data';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class MockedCarsRepository extends CarsRepository {
  private cars: Car[] = [...MOCK_CARS];

  async findAll(): Promise<Car[]> {
    return Promise.resolve(this.cars);
  }

  async create(createCarDto: CreateCarDto) {
    const newCar: Car = {
      id: uuidv4(),
      ...createCarDto,
    };

    this.cars.push(newCar);
    return Promise.resolve(newCar);
  }

  async findOne(id: string) {
    const car = this.cars.filter((car) => car.id === id)[0];

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return Promise.resolve(car);
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const carIndex = this.cars.findIndex((car) => car.id === id);

    if (carIndex === -1) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    this.cars[carIndex] = {
      ...this.cars[carIndex],
      ...updateCarDto,
    };

    return Promise.resolve(this.cars[carIndex]);
  }

  async remove(id: string) {
    const carIndex = this.cars.findIndex((c) => c.id === id);
    if (carIndex === -1) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return Promise.resolve(this.cars.splice(carIndex, 1)[0]);
  }
}
