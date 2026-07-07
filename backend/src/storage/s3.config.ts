import { BucketType } from './s3.service';

export const BUCKET_CONFIG = {
  [BucketType.CARS]: {
    name: 'AWS_BUCKET_NAME_CARS',
    getCdn: (bucketName: string, region: string) =>
      `https://${bucketName}.s3.${region}.amazonaws.com`,
  },
  [BucketType.USERS]: {
    name: 'AWS_BUCKET_NAME_USERS',
    getCdn: () => 'https://dpw47tz0j7boh.cloudfront.net',
  },
} as const;

export type BucketConfigItem = {
  name: string;
  getCdn: (bucketName?: string, region?: string) => string;
};
