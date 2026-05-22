import {
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  Min,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EngineDto } from './engine.dto';
import { BodyType } from '../body-type.enum';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1930)
  year: number;

  @IsNumber()
  @Min(0)
  mileage_km: number;

  @IsEnum(BodyType, {
    message:
      'This body type is not available. Avaulable only sedan, suv, hatchback, coupe, convertible',
  })
  body_type: string;

  @ValidateNested()
  @Type(() => EngineDto)
  engine: {
    volume: string;
    type: string;
    power_hp: number;
  };

  @IsString()
  color: string;

  @IsString()
  interior_material: string;

  @IsNumber()
  price_per_day_pln: number;

  @IsBoolean()
  is_available: boolean;
}
