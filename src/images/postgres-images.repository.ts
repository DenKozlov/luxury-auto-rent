import { Injectable, Inject } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { Prisma } from '../../prisma/generated/client';
import { S3Service } from '../storage/s3.service';

@Injectable()
export class PostgresImagesRepository extends ImagesRepository {
  constructor(@Inject(S3Service) private readonly s3Service: S3Service) {
    super();
  }

  async createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    let urls: string[] = [];
    const uploadPromises = files.map((file) =>
      this.s3Service.uploadFile(
        file,
        `cars/${Date.now()}-${file.originalname}`,
      ),
    );

    urls = await Promise.all(uploadPromises);

    const imagesData = urls.map((path) => ({
      url: path,
      carId: carId,
    }));

    await tx.carImage.createMany({
      data: imagesData,
    });
  }
}
