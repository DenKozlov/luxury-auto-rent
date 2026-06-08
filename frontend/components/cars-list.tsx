"use client";

import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/car.service";
import CarCard from "./car-card";

const CarList = ({ page = 1, limit = 10 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cars", "page", "limit"],
    queryFn: () => carService.getAll({ page, limit }),
  });

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {/* {data?.data.map((car) => {
        return <CarCard car={car} key={car.id} />;
      })} */}
    </div>
  );
};

export default CarList;
