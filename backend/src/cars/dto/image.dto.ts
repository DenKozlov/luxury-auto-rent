import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsUUID()
  @IsNotEmpty()
  carId: string;
}
