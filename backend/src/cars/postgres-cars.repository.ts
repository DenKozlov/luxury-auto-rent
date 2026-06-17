import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { instanceToPlain } from 'class-transformer';
import { Prisma } from '../../prisma/generated/client';
import { CarQueryDto } from './dto/car-pagination.dto';
import { buildCarQuery } from 'lib/query-builder';
import { Car, Filters, PaginatedResult } from 'src/common/types';

@Injectable()
export class PostgresCarsRepository extends CarsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super();
  }

  async findAll(query: CarQueryDto): Promise<PaginatedResult<Car>> {
    const where = buildCarQuery(query);
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    const [cars, totalItems] = await Promise.all([
      this.prisma.car.findMany({
        where,
        skip,
        take: limit,
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
      }),
      this.prisma.car.count({ where }),
    ]);
    const data = cars as Car[];

    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = page < totalPages;

    return { data, totalItems, limit, page, totalPages, hasMore };
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

  async getFilters(): Promise<Filters> {
    const [rawBrands, rawBodyTypes, prices] = await Promise.all([
      this.prisma.car.groupBy({ by: ['brand'], _count: { id: true } }),
      this.prisma.car.groupBy({ by: ['body_type'], _count: { id: true } }),
      this.prisma.car.aggregate({
        _min: { price_per_day_pln: true },
        _max: { price_per_day_pln: true },
      }),
    ]);
    return {
      brands: rawBrands.map((item) => ({
        value: item.brand,
        count: item._count.id,
      })),
      priceRange: {
        min: prices._min.price_per_day_pln ?? 0,
        max: prices._max.price_per_day_pln ?? 0,
      },
      bodyTypes: rawBodyTypes.map((item) => ({
        value: item.body_type,
        count: item._count.id,
      })),
    };
  }

  async getRecommended(): Promise<Car[] | null> {
    try {
      const sortedByRating = await this.prisma.car.findMany({
        orderBy: {
          rating: 'desc',
        },
        include: {
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
        take: 3,
      });

      return sortedByRating.length > 0 ? sortedByRating : null;
    } catch (error) {
      console.error('Error fetching recommended cars:', error);
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
