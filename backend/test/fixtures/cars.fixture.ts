import { BodyType } from '../../prisma/generated/client';

export const createMockCar = (overrides = {}) => ({
  brand: 'Audi',
  model: 'RS6 Avant',
  year: 2023,
  mileage_km: 15000,
  body_type: 'SEDAN' as BodyType,
  engine: { volume: '4.0L', type: 'V8', power_hp: 600 },
  color: 'Nardo Grey',
  interior_material: 'Valcona Leather',
  price_per_day_pln: 1900,
  is_available: false,
  ...overrides,
});

export const createMockCarWithImages = (images: [{ url: string }]) => ({
  ...createMockCar(),
  images: {
    create: images,
  },
});
