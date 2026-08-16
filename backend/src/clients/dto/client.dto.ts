import { IsDateString, IsEmail, IsString } from 'class-validator';

export class ClientDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  driverLicenseNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;
}
