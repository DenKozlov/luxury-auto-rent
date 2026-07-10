import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma/generated/client';
import { ImagesRepository } from './images.repository';
import { S3Service } from '../storage/s3.service';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(ImagesRepository)
    private readonly imagesRepository: ImagesRepository,
    @Inject(S3Service) private readonly s3Service: S3Service,
  ) {}
  async createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ) {
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
    return await this.imagesRepository.createImages(imagesData, tx);
  }
  async deleteImages(
    carId: string,
    tx: Prisma.TransactionClient,
    deletedImagesIds?: string[],
  ) {
    return await this.imagesRepository.deleteImages(
      carId,
      tx,
      deletedImagesIds,
    );
  }
}
