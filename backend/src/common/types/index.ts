import { Prisma } from '@/prisma/generated/client';
import { Request } from 'express';
import { User, Session } from 'better-auth';

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  limit: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ImageResponse {
  id: string;
  url: string;
}

interface EngineInterface {
  power_hp: number;
  volume: string;
  type: string;
}

export type Car = Omit<
  Prisma.CarGetPayload<{
    include: {
      images: {
        select: {
          id: true;
          url: true;
        };
      };
    };
  }>,
  'engine' | 'images'
> & {
  engine: EngineInterface | null;
  images: ImageResponse[] | null;
};

interface Option {
  value: string;
  count: number;
}

export interface Filters {
  brands: Option[];
  priceRange: {
    min: number;
    max: number;
  };
  bodyTypes: Option[];
}
export interface AuthenticatedRequest extends Request {
  user: User;
  session: {
    session: Session;
    user: User;
  };
}
export interface DeactivationContext {
  fullName: string;
  reactivationDeadline: string;
}

export interface WelcomeContext {
  fullName: string;
}

export type MailContext = DeactivationContext | WelcomeContext;
