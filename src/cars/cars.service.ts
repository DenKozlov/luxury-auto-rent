import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './car.interface';
import { MOCK_CARS } from './cars.data';

@Injectable()
export class CarsService {
  private cars: Car[] = [...MOCK_CARS];

  create(createCarDto: CreateCarDto) {
    const newCar: Car = {
      id: `car_${Date.now()}`,
      ...createCarDto,
    };

    this.cars.push(newCar);
    return newCar;
  }

  findAll() {
    return this.cars;
  }

  findOne(id: string): Car | undefined {
    return this.cars.filter((car) => car.id === id)[0];
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    const carIndex = this.cars.findIndex((car) => car.id === id);

    if (carIndex === -1) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    this.cars[carIndex] = {
      ...this.cars[carIndex],
      ...updateCarDto,
    };

    return this.cars[carIndex];
  }

  remove(id: string): Car {
    const carIndex = this.cars.findIndex((c) => c.id === id);
    if (carIndex === -1) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return this.cars.splice(carIndex, 1)[0];
  }
}
