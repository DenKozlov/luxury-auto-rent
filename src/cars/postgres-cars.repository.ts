import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    return this.prisma.car.findMany({
      orderBy: {
        brand: 'asc',
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    }) as Promise<Car[]>;
  }

  async create(dto: CreateCarDto, tx: Prisma.TransactionClient): Promise<Car> {
    const carData = instanceToPlain(dto) as Prisma.CarCreateInput;
    const validCar = {
      ...carData,
      year: Number(carData.year),
      mileage_km: Number(carData.mileage_km),
      price_per_day_pln: Number(carData.price_per_day_pln),
      is_available: Boolean(carData.is_available),
      engine: JSON.parse(carData.engine as string),
    };

    try {
      const car = await tx.car.create({ data: validCar });
      return car as Car;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Car creation failed');
    }
  }

  findOne(id: string, tx?: Prisma.TransactionClient): Promise<Car | null> {
    const prisma = tx || this.prisma;

    return prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    }) as Promise<Car | null>;
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    tx: Prisma.TransactionClient,
  ): Promise<Car | null> {
    const carData = instanceToPlain(updateCarDto) as Prisma.CarCreateInput;
    let newEngineData;
    if (carData.engine) {
      const existingCar = await tx.car.findUnique({
        where: { id },
        select: { engine: true },
      });

      if (!existingCar) {
        throw new NotFoundException(`Car with ID ${id} not found`);
      }

      newEngineData = {
        ...(existingCar?.engine as Record<string, string | number>),
        ...JSON.parse(carData.engine as string),
      };
    }

    const validCar = {
      ...carData,
      ...(carData.year && { year: Number(carData.year) }),
      ...(carData.mileage_km && { mileage_km: Number(carData.mileage_km) }),
      ...(carData.price_per_day_pln && {
        price_per_day_pln: Number(carData.price_per_day_pln),
      }),
      ...(carData.is_available && {
        is_available: Boolean(carData.is_available),
      }),
      ...(carData.engine && { engine: newEngineData }),
    };
    try {
      return (await tx.car.update({
        where: { id },
        data: validCar,
        include: { images: { select: { id: true, url: true } } },
      })) as Car;
    } catch (e) {
      console.log('Car update failed:', e);
      return null;
    }
  }

  async remove(id: string, tx: Prisma.TransactionClient): Promise<Car | null> {
    try {
      const deletedCar = await tx.car.delete({
        where: { id },
        include: { images: true },
      });

      return deletedCar as Car;
    } catch (e) {
      console.log('Car delition failed:', e);
      return null;
    }
  }
  // v8 ignore start
  async removeAll(): Promise<void> {
    await this.prisma.car.deleteMany({});
  }

  async createMany(dtos: CreateCarDto[]): Promise<number> {
    const carsData = dtos.map(
      (carDto) => instanceToPlain(carDto) as Prisma.CarCreateInput,
    );
    const result = await this.prisma.car.createMany({ data: carsData });

    return result.count;
  }
  // v8 ignore end
}
