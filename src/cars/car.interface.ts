interface EngineInterface {
  power_hp: number;
  volume: string;
  type: string;
}
import { Prisma } from '../../prisma/generated/client';

// export interface Car extends Omit<PrismaCar, 'engine'> {
//   engine: EngineInterface | null;
// }

export type Car = Omit<
  Prisma.CarGetPayload<{ include: { images: true } }>,
  'engine'
> & {
  engine: EngineInterface | null;
};
