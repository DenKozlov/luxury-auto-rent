import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
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
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  bodyType?: BodyType;

  @IsOptional()
  minPrice?: number;

  @IsOptional()
  maxPrice?: number;

  @IsOptional()
  isAvailable?: boolean;
}
