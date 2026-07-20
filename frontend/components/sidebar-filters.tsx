"use client";

import { carService } from "@/services/car.service";
import CarFiltersForm, { FiltersFormValues } from "./car-filters-form";
import { useQuery } from "@tanstack/react-query";
import { type SubmitHandler } from "react-hook-form";

export default function SidebarFilters({
  onFiltersSubmit,
}: {
  onFiltersSubmit: SubmitHandler<FiltersFormValues>;
}) {
  const { data: filters, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => carService.getFilters(),
  });

  return (
    <CarFiltersForm
      key={String(isLoading)}
      brands={filters?.brands ?? []}
      bodyTypes={filters?.bodyTypes ?? []}
      priceRange={[
        filters?.priceRange?.min ?? 0,
        filters?.priceRange?.max ?? 5000,
      ]}
      onSubmit={onFiltersSubmit}
      isLoading={isLoading}
    />
  );
}
