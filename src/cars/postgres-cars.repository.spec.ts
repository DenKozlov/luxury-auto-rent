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
import { BodyType } from '../../prisma/generated/client';
import { S3Service } from '../storage/s3.service';

describe('PostgresCarsRepository', () => {
  let repository: PostgresCarsRepository;
  let prismaMock: any;
  let s3Service: S3Service;

  beforeEach(async () => {
    prismaMock = {
      car: {
        findMany: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      $transaction: vi.fn((callback) => callback(prismaMock)),
    };

    const s3ServiceMock = {
      deleteFiles: vi.fn(),
      uploadFile: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresCarsRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: S3Service,
          useValue: s3ServiceMock,
        },
      ],
    }).compile();

    repository = module.get<PostgresCarsRepository>(PostgresCarsRepository);
    s3Service = module.get<S3Service>(S3Service);
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
        body_type: BodyType.COUPE,
        engine: JSON.stringify({ volume: '4.0L', type: 'V8', power_hp: 600 }),
        color: 'Crayon',
        interior_material: 'Leather',
        price_per_day_pln: 3000,
        is_available: true,
      };

      const mockCar = createMockCar({
        ...dto,
        engine: { volume: '4.0L', type: 'V8', power_hp: 600 },
      });
      prismaMock.car.create.mockResolvedValue(mockCar);

      const result = await repository.create(dto as any);

      expect(result).toEqual(mockCar);
      expect(prismaMock.car.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            engine: { volume: '4.0L', type: 'V8', power_hp: 600 },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a car if it exists', async () => {
      const mockCar = createMockCar({
        id: 'db_car_1',
      });
      prismaMock.car.findUnique.mockResolvedValue(mockCar);

      const result = await repository.findOne('db_car_1');

      expect(result).toEqual(mockCar);
      expect(prismaMock.car.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'db_car_1' },
        }),
      );
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
    it('should delete car and its images from S3 if images exist', async () => {
      const mockCarWithImages = createMockCar({
        id: 'db_car_1',
        images: [
          { url: 'https://test-bucket.s3.amazonaws.com/cars/img1.webp' },
        ],
      });

      prismaMock.car.delete.mockResolvedValue(mockCarWithImages);

      // Используем s3Service, который мы получили через module.get
      const s3Spy = vi
        .spyOn(s3Service, 'deleteFiles')
        .mockResolvedValue(undefined);

      const result = await repository.remove('db_car_1');

      expect(result).toEqual(mockCarWithImages);
      expect(s3Spy).toHaveBeenCalledWith([
        'https://test-bucket.s3.amazonaws.com/cars/img1.webp',
      ]);
    });

    it('should catch Prisma error and return null if car to delete does not exist', async () => {
      prismaMock.car.delete.mockRejectedValue(new Error('Record not found'));

      const result = await repository.remove('invalid_id');

      expect(result).toBeNull();
    });
  });
});
