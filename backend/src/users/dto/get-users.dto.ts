import { IsOptional, IsInt, IsString, IsNumber } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  searchBy?: 'email' | 'name';

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortDirection?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  offset?: number;
}
