import { AddImageDto } from './dto/add-image.dto';
import { Image } from './image.interface';

export abstract class ImagesRepository {
  //   abstract findAll(): Promise<Car[]>;
  abstract create(dto: AddImageDto): Promise<Image>;
  abstract remove(id: string): Promise<Image | null>;
}
