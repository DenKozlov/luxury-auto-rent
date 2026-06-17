"use client";

import { useQuery } from "@tanstack/react-query";
import CarCard from "./car-card";
import CarCardSkeleton from "./ui/card-skeleton";
import { carService } from "@/services/car.service";
import Error from "@/app/error";

const TopRated = () => {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["car"],
    queryFn: () => carService.getTopRated(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center gap-8 pt-6 pb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!cars) {
    throw new Error(`Backend failed with status: ${res.status}`);
  }

  return (
    <div>
      <div className="flex justify-center gap-8 pt-6 pb-12">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </div>
  );
};

export default TopRated;
