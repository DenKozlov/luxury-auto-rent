import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as s3Config from './s3.config';

export enum BucketType {
  CARS = 'CARS',
  USERS = 'USERS',
}

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly bucketName?: string;
  private readonly region?: string;
  private readonly bucketUrl?: string;

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject('S3_CONFIG')
    private readonly bucketConfig: s3Config.BucketConfigItem,
  ) {
    this.region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    this.bucketName = this.configService.get<string>(this.bucketConfig.name);

    if (!this.region || !accessKeyId || !secretAccessKey || !this.bucketName) {
      throw new Error('Missing AWS configuration in environment variables');
    }
    this.bucketUrl = this.bucketConfig.getCdn(this.bucketName, this.region);

    this.s3 = new S3Client({
      region: this.region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    try {
      await this.s3.send(command);
      return `${this.bucketUrl}/${key}`;
    } catch (error) {
      console.log('Error uploading file to S3:', error);
      throw new Error('Could not upload file');
    }
  }

  async deleteFiles(urls: string[]): Promise<void> {
    const prefix = `${this.bucketUrl}/`;
    const keys = urls.map((url) => url.replace(prefix, ''));

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      console.log('Error deleting files from S3:', error);
      throw new Error('Could not delete car images');
    }
  }
}
