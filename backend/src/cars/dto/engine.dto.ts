import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EngineDto {
  @ApiProperty({
    description: 'Engine volume',
  })
  @IsNotEmpty()
  @IsString()
  volume: string;

  @ApiProperty({
    description: 'Engine type',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Engine power',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  power_hp: number;
}
