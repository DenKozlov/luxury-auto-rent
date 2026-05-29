import { BodyType } from '@prisma/client';

interface EngineInterface {
  power_hp: number;
  volume: string;
  type: string;
}

// export interface Car {
//   id: string;
//   brand: string;
//   model: string;
//   year: number;
//   mileage_km: number;
//   body_type: BodyType;
//   engine: EngineInterface | null;
//   color: string;
//   interior_material: string;
//   price_per_day_pln: number;
//   is_available: boolean;
// }
import { Car as PrismaCar } from '@prisma/client';

// Говорим, что Car — это точно такой же объект, как в Призме,
// но поле engine имеет строгий тип вместо JsonValue
export interface Car extends Omit<PrismaCar, 'engine'> {
  engine: EngineInterface | null;
}
