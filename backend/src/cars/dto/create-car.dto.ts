import {
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { EngineDto } from './engine.dto';
import { BodyType } from '@/prisma/generated/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({
    description: 'Automobile brand',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Automobile model',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Automobile production year',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1930)
  year: number;

  @ApiProperty({
    description: 'Total mileage',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  mileage_km: number;

  @ApiProperty({
    description: 'Automobile body type',
  })
  @IsEnum(BodyType, {
    message:
      'This body type is not available. Available only sedan, suv, hatchback, coupe, convertible',
  })
  body_type: BodyType;

  @ApiProperty({
    description: 'Automobile engine type',
    type: EngineDto,
  })
  @ValidateNested()
  @IsNotEmpty()
  engine: EngineDto;

  @ApiProperty({
    description: 'Body color',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Automobile interior material',
  })
  @IsString()
  @IsNotEmpty()
  interior_material: string;

  @ApiProperty({
    description: 'Daily rent price',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price_per_day_pln: number;

  @ApiProperty({
    description: 'Availability in the salon',
  })
  @IsBoolean()
  @IsNotEmpty()
  is_available: boolean;
}
