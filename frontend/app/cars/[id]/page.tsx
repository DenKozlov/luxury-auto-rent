"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { carService } from "@/services/car.service";
import Breadcrumbs from "@/components/breadcrumbs";
import { RentalForm } from "@/components/rental-form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const AUTOPLAY_INTERVAL = 4000;

const CarPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [current, setCurrent] = useState(0);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const { id } = use(params);
  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getById(id),
  });

  const images = car?.images ?? [];

  const go = useCallback(
    (n: number) => setCurrent((n + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (success || canceled) {
      const timer = setTimeout(() => {
        if (success)
          toast.success(
            "Payment was successful! Your rental has been confirmed. Please check your email",
          );
        if (canceled) toast.error("Payment canceled");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [success, canceled]);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }
    const timer = setInterval(() => go(current + 1), AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [current, go, images.length]);

  if (isLoading) {
    return "Loading";
  }
  if (!car) {
    return "Not found";
  }

  const badgeSettings = {
    label: car.is_available ? "Available" : "Not available",
    colorClass: car.is_available ? "bg-green-700" : "bg-yellow-700",
  };

  return (
    <div className="pb-4 py-8 pt-16">
      <Breadcrumbs bcpPages={["Details"]} />
      <div className="w-175 mx-auto space-y-6 p-8 rounded-lg border">
        {images.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img) => (
                <div key={img.id} className="relative min-w-full h-full">
                  <Image
                    src={img.url}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="635 355"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => go(current - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full w-9 h-9 flex items-center justify-center z-10 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => go(current + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full w-9 h-9 flex items-center justify-center z-10 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === current ? "bg-white/10" : "bg-white/40"
                      }`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-2xl aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              No photo available
            </span>
          </div>
        )}
        <div className="flex items-start justify-between align-middle gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-medium">
              {car.brand} {car.model}
            </h1>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge className={badgeSettings.colorClass}>
                {badgeSettings.label}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-muted-foreground text-white"
              >
                {car.body_type}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-muted-foreground text-white"
              >
                {car.year}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-muted-foreground text-white"
              >
                {car.mileage_km.toLocaleString()} km
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-medium">
              {car.price_per_day_pln.toLocaleString()} USD
            </p>
            <p className="text-sm text-muted-foreground">per day</p>
          </div>
        </div>

        <hr className="border-border" />
        <div>
          <p className="text-sm font-medium text-white uppercase tracking-widest mb-3">
            Specifications
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Color", value: car.color },
              { label: "Interior", value: car.interior_material },
              { label: "Engyne type", value: car.engine.type },
              { label: "Engyne volume", value: `${car.engine.volume} l` },
              { label: "Power", value: `${car.engine.power_hp} hp` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-muted-foreground rounded-xl px-4 py-3"
              >
                <p className="text-xs text-white mb-1">{label}</p>
                <p className="text-sm text-white font-medium capitalize">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <RentalForm
          carName={`${car.brand} ${car.model}`}
          pricePerDay={car.price_per_day_pln}
          carId={id}
        />
        {/* <Button
          className="w-full h-12 bg-gray-500 text-lg hover:bg-gray-400 cursor-pointer"
          size="lg"
          disabled={!car.is_available}
        >
          {car.is_available ? "Book" : "Not available"}
        </Button> */}
      </div>
    </div>
  );
};

export default CarPage;
