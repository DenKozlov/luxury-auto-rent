import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  deletedAt: Date;
}
