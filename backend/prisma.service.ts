import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@my-app/database';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  // v8 ignore start
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }
  // v8 ignore end
}
