import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { describe, beforeEach, it, expect } from 'vitest';

describe('S3Service', () => {
  let service: S3Service;
  const s3Mock = mockClient(S3Client);

  beforeEach(async () => {
    s3Mock.reset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const env: Record<string, string> = {
                AWS_REGION: 'eu-north-1',
                AWS_ACCESS_KEY_ID: 'test',
                AWS_SECRET_ACCESS_KEY: 'test',
                AWS_BUCKET_NAME: 'test-bucket',
              };
              return env[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should upload a file and return url', async () => {
    s3Mock.on(PutObjectCommand).resolves({});

    const mockFile = {
      buffer: Buffer.from('test'),
      mimetype: 'image/webp',
    } as Express.Multer.File;

    const result = await service.uploadFile(mockFile, 'cars/test.webp');

    expect(result).toBe(
      'https://test-bucket.s3.eu-north-1.amazonaws.com/cars/test.webp',
    );
    expect(s3Mock.commandCalls(PutObjectCommand).length).toBe(1);
  });

  it('should delete files', async () => {
    s3Mock.on(DeleteObjectsCommand).resolves({});

    await service.deleteFiles([
      'https://test-bucket.s3.eu-north-1.amazonaws.com/cars/test.webp',
    ]);

    expect(s3Mock.commandCalls(DeleteObjectsCommand).length).toBe(1);
  });

  it('should throw error when S3 delete fails', async () => {
    s3Mock.on(DeleteObjectsCommand).rejects(new Error('AWS error'));

    await expect(service.deleteFiles(['url'])).rejects.toThrow(
      'Could not delete car images',
    );
  });

  it('should throw error when S3 upload fails', async () => {
    s3Mock.on(PutObjectCommand).rejects(new Error('AWS error'));

    const mockFile = {
      buffer: Buffer.from('test'),
      mimetype: 'image/webp',
    } as Express.Multer.File;

    await expect(service.uploadFile(mockFile, '')).rejects.toThrow(
      'Could not upload file',
    );
  });
});
