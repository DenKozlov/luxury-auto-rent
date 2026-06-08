import { Prisma } from '../../prisma/generated/client';

export abstract class ImagesRepository {
  //   abstract findAll(): Promise<Car[]>;
  abstract createImages(
    carId: string,
    files: Express.Multer.File[],
    tx: Prisma.TransactionClient,
  ): Promise<void>;
  // abstract removeImages(id: string): Promise<Image | null>;
}
