import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly bucketName?: string;
  private readonly region?: string;
  private readonly bucketUrl?: string;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    this.bucketUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;

    if (!this.region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS configuration in environment variables');
    }

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
      console.error('Error uploading file to S3:', error);
      throw new Error('Could not upload file');
    }
  }

  async deleteFiles(urls: string[]): Promise<void> {
    const keys = urls.map((url) => {
      return url.replace(this.bucketUrl ?? '', '');
    });

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting files from S3:', error);
      throw new Error('Could not delete car images');
    }
  }
}
