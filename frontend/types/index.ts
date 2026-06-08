export type BodyType = "SEDAN" | "SUV" | "HATCHBACK" | "COUPE" | "CONVERTIBLE";

interface Engine {
  volume: string;
  type: string;
  power_hp: number;
}

export interface Image {
  id: string;
  url: string;
  carId: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  body_type: BodyType;
  engine: Engine;
  color: string;
  interior_material: string;
  price_per_day_pln: number;
  is_available: boolean;
  createdAt: string;
  images: Image[];
}

export interface GetCarsParams {
  page: number;
  limit: number;
}

export interface CarsReponse {
  data: Car[];
}

export interface Filters {
  brands: Brand[];
}

export interface Brand {
  brand: string;
  count: number;
}
