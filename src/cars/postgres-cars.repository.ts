import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { PrismaService } from '../../prisma.service';
import { S3Service } from '../storage/s3.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './car.interface';
import { UpdateCarDto } from './dto/update-car.dto';
import { instanceToPlain } from 'class-transformer';
import { Prisma } from '../../prisma/generated/client';

@Injectable()
export class PostgresCarsRepository extends CarsRepository {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(S3Service) private readonly s3Service: S3Service,
  ) {
    super();
  }

  findAll(): Promise<Car[]> {
    return this.prisma.car.findMany({
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

  async create(dto: CreateCarDto, files?: Express.Multer.File[]): Promise<Car> {
    const carData = instanceToPlain(dto) as Prisma.CarCreateInput;
    const validCar = {
      ...carData,
      year: Number(carData.year),
      mileage_km: Number(carData.mileage_km),
      price_per_day_pln: Number(carData.price_per_day_pln),
      is_available: Boolean(carData.is_available),
      engine: JSON.parse(carData.engine as string),
    };

    return await this.prisma.$transaction(async (tx) => {
      let car;
      try {
        car = await tx.car.create({
          data: validCar,
        });
      } catch (e) {
        console.error('Car creation failed:', e);
        throw new BadRequestException('Car creation failed');
      }

      if (files) {
        const uploadPromises = files.map((file) =>
          this.s3Service.uploadFile(
            file,
            `cars/${Date.now()}-${file.originalname}`,
          ),
        );

        const urls = await Promise.all(uploadPromises);

        return (await tx.car.update({
          where: { id: car.id },
          data: {
            images: {
              create: urls.map((url) => ({ url })),
            },
          },
          include: { images: { select: { id: true, url: true } } },
        })) as Car;
      }

      return car as Car;
    });
  }

  findOne(id: string): Promise<Car | null> {
    return this.prisma.car.findUnique({
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

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car | null> {
    const carData = instanceToPlain(updateCarDto);
    const { deletedImagesIds, ...restData } = carData;
    try {
      if (deletedImagesIds?.length) {
        const imagesToDelete = await this.prisma.carImage.findMany({
          where: { id: { in: deletedImagesIds }, carId: id },
          select: { url: true },
        });

        if (imagesToDelete.length > 0) {
          const urls = imagesToDelete.map((img) => img.url);
          await this.s3Service.deleteFiles(urls);
        }
      }

      return await this.prisma.$transaction(async (tx) => {
        let updatedCar;
        if (deletedImagesIds?.length) {
          await tx.carImage.deleteMany({
            where: { id: { in: deletedImagesIds }, carId: id },
          });
        }
        const keys = Object.keys(restData);
        if (keys.length > 0) {
          updatedCar = await tx.car.update({
            where: { id },
            data: carData,
            include: {
              images: {
                select: { id: true, url: true },
              },
            },
          });
        } else {
          updatedCar = await tx.car.findUnique({
            where: { id },
            include: {
              images: {
                select: { id: true, url: true },
              },
            },
          });
        }

        return updatedCar as Car;
      });
    } catch (e) {
      console.error('Car update failed:', e);
      return null;
    }
  }

  async remove(id: string): Promise<Car | null> {
    try {
      const deletedCar = await this.prisma.car.delete({
        where: { id },
        include: { images: true },
      });

      if (deletedCar?.images?.length > 0) {
        const urls = deletedCar.images.map((i) => i.url);
        await this.s3Service.deleteFiles(urls);
      }

      return deletedCar as Car;
    } catch (e) {
      console.error('Car delition failed:', e);
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
