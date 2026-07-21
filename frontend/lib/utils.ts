import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays } from "date-fns";
import { DELETE_RETENTION_DAYS } from "./constants";
import { GetParams } from "@/types";
import { UseGetInvitations } from "@/hooks/use-get-invitations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExpiryDate = (days = DELETE_RETENTION_DAYS): Date => {
  return addDays(new Date(), days);
};

export const getParams = ({
  debouncedSearch,
  searchBy,
  sorting,
  pagination,
}: GetParams) => {
  const sort = sorting[0];
  const params = {
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    sortBy: sort?.id,
    sortDirection: sort ? (sort.desc ? "desc" : "asc") : undefined,
    ...(!!debouncedSearch
      ? {
          search: debouncedSearch,
          searchBy,
        }
      : {}),
  };

  return params;
};

export const getCustomRequestParams = ({
  search,
  sorting,
  pagination,
}: UseGetInvitations) => {
  const sort = sorting[0];
  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sort?.id,
    sortDirection: sort ? (sort.desc ? "desc" : "asc") : undefined,
    ...(!!search
      ? {
          search: search,
        }
      : {}),
  };

  return params;
};
