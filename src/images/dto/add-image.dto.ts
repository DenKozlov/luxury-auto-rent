import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsUUID()
  @IsNotEmpty()
  carId: string;
}
