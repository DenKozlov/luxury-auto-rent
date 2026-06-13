import { Filters, PaginatedResult } from 'src/common/types';
import { Car } from 'src/common/types';
import { CarQueryDto } from './dto/car-pagination.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Prisma } from 'prisma/generated/client';

export abstract class CarsRepository {
  abstract findAll(query: CarQueryDto): Promise<PaginatedResult<Car>>;
  abstract create(
    dto: CreateCarDto,
    tx: Prisma.TransactionClient,
  ): Promise<Car>;
  abstract remove(
    id: string,
    tx: Prisma.TransactionClient,
  ): Promise<Car | null>;
  abstract update(
    id: string,
    carData: UpdateCarDto,
    tx: Prisma.TransactionClient,
  ): Promise<Car | null>;
  abstract findOne(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Car | null>;
  abstract removeAll(): Promise<void>;
  abstract createMany(dtos: CreateCarDto[]): Promise<number>;
  abstract getFilters(): Promise<Filters>;
}
