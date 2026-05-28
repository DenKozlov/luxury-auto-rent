import { Car } from './car.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

export abstract class CarsRepository {
  abstract findAll(): Promise<Car[]>;
  abstract create(dto: CreateCarDto): Promise<Car>;
  abstract remove(id: string): Promise<void>;
  abstract update(id: string, updateCarDto: UpdateCarDto): Promise<Car>;
  abstract findOne(id: string): Promise<Car>;
}
