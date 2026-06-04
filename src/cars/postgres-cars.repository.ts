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
    let urls: string[] = [];
    const carData = instanceToPlain(dto) as Prisma.CarCreateInput;
    const validCar = {
      ...carData,
      year: Number(carData.year),
      mileage_km: Number(carData.mileage_km),
      price_per_day_pln: Number(carData.price_per_day_pln),
      is_available: Boolean(carData.is_available),
      engine: JSON.parse(carData.engine as string),
    };
    const hasFiles = files && files.length > 0;

    if (hasFiles) {
      const uploadPromises = files.map((file) =>
        this.s3Service.uploadFile(
          file,
          `cars/${Date.now()}-${file.originalname}`,
        ),
      );

      urls = await Promise.all(uploadPromises);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const car = await tx.car.create({ data: validCar });

        if (hasFiles) {
          return (await tx.car.update({
            where: { id: car.id },
            data: { images: { create: urls.map((url) => ({ url })) } },
            include: { images: { select: { id: true, url: true } } },
          })) as Car;
        }
        return car as Car;
      });
    } catch (e) {
      if (urls.length > 0) {
        await this.s3Service
          .deleteFiles(urls)
          .catch((err) => console.log('Failed to rollback S3 files:', err));
      }
      throw new BadRequestException('Car creation failed');
    }
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
    const { deletedImagesIds, ...restData } = instanceToPlain(updateCarDto);

    try {
      let imagesToDelete: { url: string }[] = [];

      const updatedCar = await this.prisma.$transaction(async (tx) => {
        if (deletedImagesIds?.length) {
          imagesToDelete = await tx.carImage.findMany({
            where: { id: { in: deletedImagesIds }, carId: id },
            select: { url: true },
          });

          await tx.carImage.deleteMany({
            where: { id: { in: deletedImagesIds }, carId: id },
          });
        }

        return await tx.car.update({
          where: { id },
          data: restData,
          include: { images: { select: { id: true, url: true } } },
        });
      });

      if (imagesToDelete.length > 0) {
        const urls = imagesToDelete.map((img) => img.url);
        await this.s3Service.deleteFiles(urls).catch((err) => {
          console.log('S3 deletion failed after DB commit', err);
        });
      }

      return updatedCar as Car;
    } catch (e) {
      console.log('Car update failed:', e);
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
