import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
