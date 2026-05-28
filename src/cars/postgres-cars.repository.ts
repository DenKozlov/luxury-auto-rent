import { Injectable, NotFoundException } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './car.interface';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class PostgresCarsRepository extends CarsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Car[]> {
    const cars = await this.prisma.car.findMany();
    return cars as Car[];
  }

  async create(dto: CreateCarDto): Promise<Car> {
    const newCar = await this.prisma.car.create({
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
    });

    return newCar as Car;
  }

  async remove(id: string): Promise<void> {
    const car = await this.prisma.car.delete({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return car as Car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return car as Car;
  }
}
