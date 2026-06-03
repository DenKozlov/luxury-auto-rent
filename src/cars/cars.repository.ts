import { Car } from './car.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

export abstract class CarsRepository {
  abstract findAll(): Promise<Car[]>;
  abstract create(
    dto: CreateCarDto,
    files?: Express.Multer.File[],
  ): Promise<Car>;
  abstract remove(id: string): Promise<Car | null>;
  abstract update(id: string, updateCarDto: UpdateCarDto): Promise<Car | null>;
  abstract findOne(id: string): Promise<Car | null>;
  abstract removeAll(): Promise<void>;
  abstract createMany(dtos: CreateCarDto[]): Promise<number>;
}
