import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    car: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
    },
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { PostgresCarsRepository } from './postgres-cars.repository.js';
import { PrismaService } from '../../prisma.service.js';
import { createMockCar } from '../../test/fixtures/cars.fixture';
import { BodyType } from '@prisma/client';
import { CreateCarDto } from './dto/create-car.dto.js';

describe('PostgresCarsRepository', () => {
  let repository: PostgresCarsRepository;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      car: {
        findMany: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresCarsRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<PostgresCarsRepository>(PostgresCarsRepository);
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const mockCar = createMockCar();
      prismaMock.car.findMany.mockResolvedValue([mockCar]);

      const result = await repository.findAll();

      expect(result).toEqual([mockCar]);
      expect(prismaMock.car.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should successfully create and return a car', async () => {
      const dto = {
        brand: 'Porsche',
        model: '911 Carrera',
        year: 2024,
        mileage_km: 1000,
        body_type: 'COUPE' as BodyType,
        engine: { volume: '4.0L', type: 'V8', power_hp: 600 },
        color: 'Crayon',
        interior_material: 'Leather',
        price_per_day_pln: 3000,
        is_available: true,
      };

      const mockCar = createMockCar(dto);
      prismaMock.car.create.mockResolvedValue(mockCar);

      const result = await repository.create(dto);

      expect(result).toEqual(mockCar);
      expect(prismaMock.car.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          is_available: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a car if it exists', async () => {
      const mockCar = createMockCar({ id: 'db_car_1' });
      prismaMock.car.findUnique.mockResolvedValue(mockCar);

      const result = await repository.findOne('db_car_1');

      expect(result).toEqual(mockCar);
      expect(prismaMock.car.findUnique).toHaveBeenCalledWith({
        where: { id: 'db_car_1' },
      });
    });

    it('should return null if car does not exist', async () => {
      prismaMock.car.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('invalid_id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should successfully update and return the car if it exists', async () => {
      const updateDto = { price_per_day_pln: 3500 };
      const mockCar = createMockCar({ id: 'db_car_1', ...updateDto });

      prismaMock.car.update.mockResolvedValue(mockCar);

      const result = await repository.update('db_car_1', updateDto);

      expect(result).toEqual(mockCar);
    });

    it('should catch Prisma error and return null if car to update does not exist', async () => {
      prismaMock.car.update.mockRejectedValue(new Error('Record not found'));

      const result = await repository.update('invalid_id', {
        price_per_day_pln: 0,
      });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should successfully delete and return the car if it exists', async () => {
      const mockCar = createMockCar({ id: 'db_car_1' });
      prismaMock.car.delete.mockResolvedValue(mockCar);

      const result = await repository.remove('db_car_1');

      expect(result).toEqual(mockCar);
    });

    it('should catch Prisma error and return null if car to delete does not exist', async () => {
      prismaMock.car.delete.mockRejectedValue(new Error('Record not found'));

      const result = await repository.remove('invalid_id');

      expect(result).toBeNull();
    });
  });
});
