export class CreateCarDto {
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  body_type: string;
  engine: {
    volume: string;
    type: string;
    power_hp: number;
  };
  color: string;
  interior_material: string;
  price_per_day_pln: number;
  is_available: boolean;
}
