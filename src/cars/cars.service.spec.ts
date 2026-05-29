import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service.js';
import { CarsRepository } from './cars.repository.js';
import { NotFoundException } from '@nestjs/common';
import { createMockCar } from '../../test/fixtures/cars.fixture';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';

const mockDbCar = createMockCar();

describe('CarsService', () => {
  let service: CarsService;
  let repositoryMock: Mocked<CarsRepository>;

  beforeEach(async () => {
    const mockRepoFactory = () => ({
      findOne: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: CarsRepository,
          useValue: mockRepoFactory(),
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    repositoryMock = module.get(CarsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a car if it exists', async () => {
    repositoryMock.findOne.mockResolvedValue(mockDbCar);

    const result = await service.findOne('car_004');

    expect(result).toEqual(mockDbCar);
    expect(repositoryMock.findOne).toHaveBeenCalledWith('car_004');
  });

  it('should throw NotFoundException if searched car does not exist', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return cars list', async () => {
    repositoryMock.findAll.mockResolvedValue([mockDbCar]);

    const result = await service.findAll();

    expect(result).toEqual([mockDbCar]);
  });

  it('should add new car to the list', async () => {
    repositoryMock.create.mockResolvedValue(mockDbCar);

    const result = await service.create(mockDbCar);

    expect(result).toEqual(mockDbCar);
    expect(repositoryMock.create).toHaveBeenCalledWith(mockDbCar);
  });

  it('should delete car if it exists', async () => {
    repositoryMock.remove.mockResolvedValue(mockDbCar);

    await service.remove('car_004');

    expect(repositoryMock.remove).toHaveBeenCalledWith('car_004');
  });

  it('should throw NotFoundException if removed car does not exist', async () => {
    repositoryMock.remove.mockResolvedValue(null);

    await expect(service.remove('invalid_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update car', async () => {
    repositoryMock.update.mockResolvedValue(mockDbCar);

    const result = await service.update('car_004', { is_available: true });

    expect(result).toEqual(mockDbCar);
    expect(repositoryMock.update).toHaveBeenCalledWith('car_004', {
      is_available: true,
    });
  });

  it('should throw NotFoundException if updated car does not exist', async () => {
    repositoryMock.update.mockResolvedValue(null);

    await expect(service.update('invalid_id', {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
