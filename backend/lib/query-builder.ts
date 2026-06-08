import { CarQueryDto } from 'src/cars/dto/car-pagination.dto';
import { Prisma } from '../prisma/generated/client';

export function buildCarQuery(query: CarQueryDto) {
  const where: Prisma.CarWhereInput = {};

  const filters = {
    brand: 'brand',
    bodyType: 'body_type',
    isAvailable: 'is_available',
  };

  for (const [key, dbColumn] of Object.entries(filters)) {
    if (query[key as keyof CarQueryDto] !== undefined) {
      where[dbColumn] = query[key as keyof CarQueryDto];
    }
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price_per_day_pln = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }

  return where;
}
