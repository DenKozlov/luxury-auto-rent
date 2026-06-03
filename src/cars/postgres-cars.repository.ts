import { Inject, Injectable } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './car.interface';
import { UpdateCarDto } from './dto/update-car.dto';
import { instanceToPlain } from 'class-transformer';
import { Prisma } from '../../prisma/generated/client';

@Injectable()
export class PostgresCarsRepository extends CarsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super();
  }

  findAll(): Promise<Car[]> {
    return this.prisma.car.findMany() as Promise<Car[]>;
  }

  create(dto: CreateCarDto): Promise<Car> {
    const carData = instanceToPlain(dto) as Prisma.CarCreateInput;

    return this.prisma.car.create({ data: carData }) as Promise<Car>;
  }

  findOne(id: string): Promise<Car | null> {
    return this.prisma.car.findUnique({ where: { id } }) as Promise<Car | null>;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car | null> {
    const carData = instanceToPlain(updateCarDto) as Prisma.CarUpdateInput;
    try {
      return (await this.prisma.car.update({
        where: { id },
        data: carData,
      })) as Car;
    } catch (e) {
      return null;
    }
  }

  async remove(id: string): Promise<Car | null> {
    try {
      return (await this.prisma.car.delete({ where: { id } })) as Car;
    } catch (e) {
      return null;
    }
  }
  removeAll(): Promise<void> {
    return this.prisma.car.deleteAll() as Promise<void>;
  }
}
