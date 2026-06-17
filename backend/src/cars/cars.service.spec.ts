import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service.js';
import { CarsRepository } from './cars.repository.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockCar } from '../../test/fixtures/cars.fixture';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  Mocked,
  afterEach,
} from 'vitest';
import { ImagesService } from '../images/images.service.js';
import { PrismaService } from '../../prisma.service';
import { prisma } from '../../vitest.setup';
import { Car } from './car.interface.js';
import { CreateCarDto } from './dto/create-car.dto.js';

const mockCar = createMockCar({
  id: 'car_004',
  createdAt: new Date(),
  images: [{ url: '' }],
}) as Car;

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
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: CarsRepository,
          useValue: mockRepoFactory(),
        },
        {
          provide: ImagesService,
          useValue: {
            createImages: vi.fn(),
            deleteImages: vi.fn(),
          },
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
    repositoryMock.findOne.mockResolvedValue(mockCar);

    const result = await service.findOne('car_004');

    expect(result).toEqual(mockCar);
  });

  it('should throw NotFoundException if searched car does not exist', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return cars list', async () => {
    repositoryMock.findAll.mockResolvedValue([mockCar]);

    const result = await service.findAll();

    expect(result).toEqual([mockCar]);
  });

  it('should add new car to the list', async () => {
    repositoryMock.create.mockResolvedValue(mockCar);
    repositoryMock.findOne.mockResolvedValue(mockCar);

    const result = await service.create(mockCar as CreateCarDto, []);

    expect(result).toEqual(mockCar);
  });

  it('should delete car if it exists', async () => {
    repositoryMock.remove.mockResolvedValue({ ...mockCar, id: 'car_004' });

    await service.remove('car_004');

    expect(repositoryMock.remove).toHaveBeenCalledWith(
      'car_004',
      expect.anything(),
    );
  });

  it('should throw NotFoundException if removed car does not exist', async () => {
    repositoryMock.remove.mockResolvedValue(null);

    await expect(service.remove('invalid_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update car', async () => {
    repositoryMock.update.mockResolvedValue(mockCar);
    repositoryMock.findOne.mockResolvedValue(mockCar);

    const result = await service.update('car_004', { is_available: true });

    expect(result).toEqual(mockCar);
  });

  it('should throw BadRequestException on DB conflict', async () => {
    repositoryMock.findOne.mockResolvedValue(mockCar);
    repositoryMock.update.mockRejectedValue(new BadRequestException());

    await expect(service.update(mockCar.id, {})).rejects.toThrow(
      BadRequestException,
    );
  });
});
