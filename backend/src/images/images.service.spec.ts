import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ImagesRepository } from './images.repository';
import { S3Service } from '../storage/s3.service';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: S3Service,
          useValue: {
            uploadFile: vi.fn(),
            deleteFiles: vi.fn(),
          },
        },
        {
          provide: ImagesRepository,
          useValue: {
            createImages: vi.fn(),
            deleteImages: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
