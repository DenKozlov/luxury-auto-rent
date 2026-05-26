import { BodyType } from './body-type.enum';

interface EngineInterface {
  power_hp: number;
  volume: string;
  type: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  body_type: BodyType;
  engine: EngineInterface;
  color: string;
  interior_material: string;
  price_per_day_pln: number;
  is_available: boolean;
}
