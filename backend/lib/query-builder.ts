import { CarQueryDto } from 'src/cars/dto/car-pagination.dto';
import { Prisma } from '../prisma/generated/client';

export function buildCarQuery(query: CarQueryDto) {
  const where: Prisma.CarWhereInput = {};

  if (query.brands !== undefined) {
    where.brand = { in: query.brands };
  }

  if (query.bodyTypes !== undefined) {
    where.body_type = { in: query.bodyTypes };
  }

  if (query.isAvailable !== undefined) {
    where.is_available = query.isAvailable;
  }

  if (query.priceRange !== undefined) {
    where.price_per_day_pln = {
      ...{ gte: query.priceRange[0] },
      ...{ lte: query.priceRange[1] },
    };
  }

  return where;
}
