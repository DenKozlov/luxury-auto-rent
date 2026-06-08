import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car } from "@/types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Gauge,
  Fuel,
  Car as CarIcon,
  MoveRight,
} from "lucide-react";

const CarCard = ({ car }: { car: Car }) => {
  const {
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
    <Card
      key={car.id}
      className="pt-0 w-[320px] h-[380px] group transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl hover:z-10"
    >
      <div className="relative w-full h-[230px] bg-muted">
        <Image
          src={images[0]?.url}
          alt={brand}
          fill
          className="object-cover object-center"
        />
        <button className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-all duration-300 hover:shadow-xl">
          <MoveRight className="h-4 w-4" />
        </button>
      </div>
      <Separator />
      <CardContent>
        <p>{brand}</p>
        <div className="flex flex-wrap items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {model}
          </h3>
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
  );
};

export default CarCard;
