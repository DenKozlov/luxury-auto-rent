import { Prisma } from '../../prisma/generated/client';

export abstract class ImagesRepository {
  abstract createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ): Promise<void>;
  abstract deleteImages(
    carId: string,
    tx: Prisma.TransactionClient,
    imagesIds?: string[],
  ): Promise<void>;
}
