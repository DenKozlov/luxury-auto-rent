vi.mock('@prisma/client', async () => {
  const actual = await vi.importActual<typeof PrismaModule>('@prisma/client');

  return {
    ...actual,
    PrismaClient: vi.fn().mockImplementation(() => ({})),
  };
});

import { validate } from 'class-validator';
import { CreateCarDto } from './create-car.dto.js';
import { EngineDto } from './engine.dto.js';
import { it, describe, expect, vi } from 'vitest';
import * as PrismaModule from '@prisma/client';

const getValidDto = (): CreateCarDto => {
  const dto = new CreateCarDto();
  const engine = new EngineDto();
  dto.brand = 'Porsche';
  dto.model = '911';
  dto.year = 2024;
  dto.mileage_km = 1000;
  dto.body_type = 'COUPE';
  dto.color = 'Crayon';
  dto.interior_material = 'Leather';
  dto.price_per_day_pln = 3000;
  dto.is_available = true;

  engine.volume = '4.0L';
  engine.type = 'V8';
  engine.power_hp = 600;
  dto.engine = engine;
  return dto;
};

describe('Cars DTO Validation', () => {
  it('should pass validation with valid data', async () => {
    const dto = getValidDto();
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if required fields are missing', async () => {
    const dto = getValidDto();
    dto.brand = '';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('brand');
  });

  it('should fail validation if numbers are invalid', async () => {
    const dto = getValidDto();
    dto.year = 1800;
    dto.mileage_km = -50;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
