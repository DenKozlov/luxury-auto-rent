import { RentalStatus } from '@/prisma/generated/enums';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class RentalDto {
  @IsNumber()
  totalPrice: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  status?: RentalStatus;

  @IsBoolean()
  isPaid?: boolean;

  @IsString()
  pickupLocation: string;

  @IsString()
  dropoffLocation: string;

  @IsUUID()
  carId: string;
}
