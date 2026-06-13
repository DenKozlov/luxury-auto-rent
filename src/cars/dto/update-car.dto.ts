import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  deletedImagesIds?: string[];
}
