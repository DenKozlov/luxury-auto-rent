import { PaginationState, SortingState } from "@tanstack/react-table";
import { User } from "better-auth";

export type BodyType = "SEDAN" | "SUV" | "HATCHBACK" | "COUPE" | "CONVERTIBLE";

interface Engine {
  volume: string;
  type: string;
  power_hp: number;
}

export interface Image {
  id: string;
  url: string;
  carId: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  body_type: BodyType;
  engine: Engine;
  color: string;
  interior_material: string;
  price_per_day_pln: number;
  is_available: boolean;
  createdAt: string;
  images: Image[];
  rating: number;
}

export interface GetCarsParams {
  page: number;
  limit: number;
}

export interface CarsReponse {
  data: Car[];
  hasMore: boolean;
  page: number;
}

export interface Filters {
  brands?: Option[];
  bodyTypes?: Option[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface Option {
  value: string;
  count: number;
}

export interface ExtendedUser extends User {
  status: "ACTIVE" | "DEACTIVATED";
  lastLoginAt: string;
  role: string;
}

export interface ListUsersResponse {
  users: ExtendedUser[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface GetParams {
  searchBy: string;
  debouncedSearch: string;
  sorting: SortingState;
  pagination: PaginationState;
}

export interface Invitation {
  id: string;
  invitedBy: string;
  createdAt: string;
  acceptedAt: string;
  expiresAt: string;
  status: string;
  role: string;
  email: string;
}

export interface ListInvitationsResponse {
  invitations: Invitation[];
  hasMore: boolean;
  page: number;
  totalItems: number;
}
