import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { AddImageDto } from './dto/add-image.dto';

@Injectable()
export class ImagesService {
  //   constructor(private prisma: PrismaService) {}
  //   async addImages(dto: AddImageDto) {
  //     return await this.prisma.carImage.create({
  //       data: {
  //         url: dto.url,
  //         carId: dto.carId,
  //       },
  //     });
  //   }
  //   async getImagesByCarId(carId: string) {
  //     return await this.prisma.carImage.findMany({
  //       where: { carId },
  //     });
  //   }
}
