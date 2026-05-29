import { Inject, Injectable } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './car.interface';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class PostgresCarsRepository extends CarsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super();
  }

  findAll(): Promise<Car[]> {
    return this.prisma.car.findMany() as Promise<Car[]>;
  }

  create(dto: CreateCarDto): Promise<Car> {
    return this.prisma.car.create({
      data: {
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        mileage_km: dto.mileage_km,
        body_type: dto.body_type,
        engine: dto.engine,
        color: dto.color,
        interior_material: dto.interior_material,
        price_per_day_pln: dto.price_per_day_pln,
        is_available: dto.is_available ?? true,
      },
    }) as Promise<Car>;
  }

  findOne(id: string): Promise<Car | null> {
    return this.prisma.car.findUnique({ where: { id } }) as Promise<Car | null>;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car | null> {
    try {
      return (await this.prisma.car.update({
        where: { id },
        data: updateCarDto,
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
}
