import { Card, CardContent } from "@/components/ui/card";
import { Car } from "@/types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Gauge, Fuel, Car as CarIcon } from "lucide-react";
import Link from "next/link";
import CarRating from "./car-ratings";

const CarCard = ({ car }: { car: Car }) => {
  const {
    id,
    images,
    model,
    brand,
    is_available,
    year,
    body_type,
    engine,
    mileage_km,
  } = car;
  const badgeSettings = {
    label: is_available ? "Available" : "Not available",
    colorClass: is_available ? "bg-green-700" : "bg-yellow-700",
  };
  return (
    <Link href={`/cars/${id}`} data-testid="car-card-link">
      <Card
        key={car.id}
        className="pt-0 w-80 min-w-80 bg-[#1c1c1e] text-white border border-[#2c2c2e] h-96 group transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl hover:z-10"
      >
        <div className="relative w-full h-56 bg-muted">
          <Image
            src={images[0]?.url}
            alt={brand}
            fill
            className="object-cover object-center"
            sizes="h-56 w-80"
          />
        </div>
        <Separator />
        <CardContent>
          <div className="flex justify-between items-center">
            <p>{brand}</p>
            <CarRating rating={car.rating} />
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {model}
            </p>
            <Badge className={badgeSettings.colorClass}>
              {badgeSettings.label}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={24} className="text-muted-foreground" />
              <p>{year}</p>
            </div>

            <div className="flex items-center gap-2">
              <CarIcon size={24} className="text-muted-foreground" />
              <p className="lowercase">{body_type}</p>
            </div>

            <div className="flex items-center gap-2">
              <Fuel size={24} className="text-muted-foreground" />
              <p className="capitalize">{engine.type}</p>
            </div>

            <div className="flex items-center gap-2">
              <Gauge size={24} className="text-muted-foreground" />
              <p>{mileage_km} km</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CarCard;
