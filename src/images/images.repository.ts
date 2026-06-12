import { Prisma } from '../../prisma/generated/client';

export abstract class ImagesRepository {
  abstract createImages(
    imagesData: {
      url: string;
      carId: string;
    }[],
    tx: Prisma.TransactionClient,
  ): Promise<void>;
  abstract deleteImages(
    carId: string,
    tx: Prisma.TransactionClient,
    imagesIds?: string[],
  ): Promise<void>;
}
