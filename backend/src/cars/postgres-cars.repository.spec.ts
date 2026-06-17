import { vi, describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../vitest.setup';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgresCarsRepository } from './postgres-cars.repository.js';
import { PrismaService } from '../../prisma.service.js';
import {
  createMockCar,
  createMockCarWithImages,
} from '../../test/fixtures/cars.fixture';
import { S3Service } from '../storage/s3.service';

describe('PostgresCarsRepository', () => {
  let repository: PostgresCarsRepository;
  vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(async () => {
    const s3ServiceMock = {
      deleteFiles: vi.fn(),
      uploadFile: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresCarsRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: S3Service,
          useValue: s3ServiceMock,
        },
      ],
    }).compile();

    repository = module.get<PostgresCarsRepository>(PostgresCarsRepository);
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const mockCar = createMockCar();
      await prisma.car.create({ data: mockCar });

      const result = await repository.findAll();

      expect(result).toEqual([expect.objectContaining(mockCar)]);
    });
  });

  describe('create', () => {
    it('should successfully create and return a car', async () => {
      const mockCar = createMockCar();
      const car = await prisma.car.create({ data: mockCar });

      expect(car).toEqual(expect.objectContaining(mockCar));
    });
  });

  describe('findOne', () => {
    it('should return a car if it exists', async () => {
      const mockCar = createMockCar();
      const car = await prisma.car.create({ data: mockCar });

      const result = await repository.findOne(car.id);
      expect(result).toEqual(expect.objectContaining(mockCar));
    });

    it('should return null if car does not exist', async () => {
      const result = await repository.findOne('invalid_id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should successfully update and return the car if it exists', async () => {
      const updateDto = { price_per_day_pln: 3500 };
      const mockCar = createMockCar(updateDto);
      const car = await prisma.car.create({ data: mockCar });

      const result = await repository.update(car.id, updateDto, prisma);

      expect(result).toEqual(expect.objectContaining(mockCar));
    });

    it('should catch Prisma error and return null if car to update does not exist', async () => {
      const result = await repository.update(
        'invalid_id',
        {
          price_per_day_pln: 0,
        },
        prisma,
      );

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete car and its images from S3 if images exist', async () => {
      const mockCarWithImages = createMockCarWithImages([
        { url: 'https://test-bucket.s3.amazonaws.com/cars/img1.webp' },
      ]);

      const car = await prisma.car.create({ data: mockCarWithImages });

      const result = await repository.remove(car.id, prisma);

      expect(result).toEqual(
        expect.objectContaining({
          ...mockCarWithImages,
          images: expect.arrayContaining([
            expect.objectContaining({
              url: 'https://test-bucket.s3.amazonaws.com/cars/img1.webp',
            }),
          ]),
        }),
      );
    });

    it('should catch Prisma error and return null if car to delete does not exist', async () => {
      const result = await repository.remove('invalid_id', prisma);

      expect(result).toBeNull();
    });
  });
});
