import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { BodyType } from 'prisma/generated/enums';

export class CarQueryDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  page: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsArray()
  brands?: string[];

  @IsOptional()
  @IsArray()
  bodyTypes?: BodyType[];

  @IsArray()
  @IsOptional()
  priceRange?: [number, number];

  @IsOptional()
  isAvailable?: boolean;
}
