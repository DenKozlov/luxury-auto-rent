import { IsString, IsNumber, Min } from 'class-validator';

export class EngineDto {
  @IsString()
  volume: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  power_hp: number;
}