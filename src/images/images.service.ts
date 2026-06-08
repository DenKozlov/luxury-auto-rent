import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { S3Service } from '../storage/s3.service';
import { Prisma } from '../../prisma/generated/client';
import { ImagesRepository } from './images.repository';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(S3Service) private readonly s3Service: S3Service,
    private readonly imagesRepository: ImagesRepository,
  ) {}
  async createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ) {
    return await this.imagesRepository.createImages(carId, files, tx);
  }
  //   async getImagesByCarId(carId: string) {
  //     return await this.prisma.carImage.findMany({
  //       where: { carId },
  //     });
  //   }
}
