import { useInfiniteQuery } from "@tanstack/react-query";
import { carService } from "@/services/car.service";
import { Filters } from "@/types";

export const useCars = (filters?: Filters, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["cars", filters],
    queryFn: ({ pageParam = 1 }) =>
      carService.getAll({ ...filters, page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};
