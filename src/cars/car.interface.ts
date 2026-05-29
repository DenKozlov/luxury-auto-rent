interface EngineInterface {
  power_hp: number;
  volume: string;
  type: string;
}
import { Car as PrismaCar } from '@prisma/client';

export interface Car extends Omit<PrismaCar, 'engine'> {
  engine: EngineInterface | null;
}
