import { IsNotEmpty, IsUUID, IsUrl } from 'class-validator';

export class AddImageDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsUUID()
  @IsNotEmpty()
  carId: string;
}
