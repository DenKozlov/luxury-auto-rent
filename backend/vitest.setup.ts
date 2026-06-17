import { beforeEach, afterAll } from 'vitest';
import { PrismaClient } from './prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

beforeEach(async () => {
  await prisma.car.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
