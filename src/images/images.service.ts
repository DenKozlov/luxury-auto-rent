import { Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma/generated/client';
import { ImagesRepository } from './images.repository';

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}
  async createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ) {
    return await this.imagesRepository.createImages(carId, files, tx);
  }
  async deleteImages(carId: string, tx: Prisma.TransactionClient) {
    return await this.imagesRepository.deleteImages(carId, tx);
  }
}
