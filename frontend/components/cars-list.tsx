"use client";

import CarCard from "./car-card";
import CarCardSkeleton from "./ui/card-skeleton";
import { useEffect, useRef } from "react";
import { useCars } from "@/hooks/use-get-cars";
import { Filters } from "@/types";

const CarList = ({ filters }: { filters: Filters }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCars(filters, 20);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const cars = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-wrap gap-6 justify-start">
      {isLoading ? (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <CarCardSkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {cars.map((car) => (
            <CarCard car={car} key={car.id} />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 8 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}

          <div ref={loaderRef} className="col-span-full h-4" />
        </>
      )}
    </div>
  );
};

export default CarList;
