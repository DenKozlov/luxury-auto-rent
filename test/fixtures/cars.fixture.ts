import { BodyType } from '@prisma/client';

export const createMockCar = (overrides = {}) => ({
  id: 'car_004',
  brand: 'Audi',
  model: 'RS6 Avant',
  year: 2023,
  mileage_km: 15000,
  body_type: BodyType.SEDAN,
  engine: { volume: '4.0L', type: 'V8', power_hp: 600 },
  color: 'Nardo Grey',
  interior_material: 'Valcona Leather',
  price_per_day_pln: 1900,
  is_available: false,
  createdAt: new Date(),
  ...overrides,
});
