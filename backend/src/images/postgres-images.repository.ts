import { Injectable, Inject } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { Prisma } from '@/prisma/generated/client';
import { S3Service } from '../storage/s3.service';

@Injectable()
export class PostgresImagesRepository extends ImagesRepository {
  constructor(private readonly s3Service: S3Service) {
    super();
  }

  async createImages(
    imagesData: {
      url: string;
      carId: string;
    }[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.carImage.createMany({
      data: imagesData,
    });
  }
  async deleteImages(
    carId: string,
    tx: Prisma.TransactionClient,
    imagesIds?: string[],
  ): Promise<void> {
    let imagesToDelete: { url: string }[] = [];

    if (imagesIds) {
      imagesToDelete = await tx.carImage.findMany({
        where: { id: { in: imagesIds }, carId },
        select: { url: true },
      });

      await tx.carImage.deleteMany({
        where: { id: { in: imagesIds }, carId },
      });
    } else {
      imagesToDelete = await tx.carImage.findMany({
        where: { carId },
        select: { url: true },
      });
      await tx.carImage.deleteMany({ where: { carId } });
    }

    const urls = imagesToDelete.map((img) => img.url);
    await this.s3Service.deleteFiles(urls);
  }
}
