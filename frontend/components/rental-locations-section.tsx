"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DeliveryMapModal } from "@/components/delivery-map-modal";
import { FieldError } from "./ui/field";
import { BookingFormValues } from "./rental-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Office } from "@/types";

const PRESET_OFFICES: Office[] = [
  {
    id: "dxb-airport",
    name: "Dubai Airport (DXB) Terminal 3",
    address: "Airport Road, Al Garhoud, Dubai",
    lat: 25.2532,
    lng: 55.3657,
    workingHours: "24/7",
    photoUrl: "/airport.webp",
  },
  {
    id: "dubai-mall",
    name: "The Dubai Mall",
    address: "Financial Center Rd, Downtown Dubai, Dubai",
    lat: 25.1972,
    lng: 55.2744,
    workingHours: "09:00 - 21:00",
    photoUrl: "/mall.webp",
  },
  {
    id: "dubai-marina",
    name: "Dubai Marina Office",
    address: "Al Marsa St, Dubai Marina, Dubai",
    lat: 25.0805,
    lng: 55.1403,
    workingHours: "08:00 - 22:00",
    photoUrl: "/marina.webp",
  },
];

export function RentalLocationsSection() {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const pickupAddress = watch("pickupLocation") || "";
  const returnAddress = watch("dropoffLocation") || "";
  const [isPickupMapOpen, setIsPickupMapOpen] = useState(false);
  const [isReturnMapOpen, setIsReturnMapOpen] = useState(false);
  const [sameAsPickup, setSameAsPickup] = useState(true);

  const [pickupMode, setPickupMode] = useState<"preset" | "custom">("preset");
  const [returnMode, setReturnMode] = useState<"preset" | "custom">("preset");

  useEffect(() => {
    if (sameAsPickup) {
      setValue("dropoffLocation", pickupAddress);
    }
  }, [sameAsPickup, pickupAddress, setValue]);

  return (
    <div className="space-y-6">
      <div className="space-y-3 bg-white p-4 rounded-xl border mb-4">
        <label className="block text-sm font-semibold text-gray-800">
          Where do you want to pick up a car?
        </label>

        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setPickupMode("preset")}
            className={`py-1.5 text-xs font-medium rounded-md transition ${pickupMode === "preset" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Our office
          </button>
          <button
            type="button"
            onClick={() => {
              setPickupMode("custom");
              setIsPickupMapOpen(true);
            }}
            className={`py-1.5 text-xs font-medium rounded-md transition ${pickupMode === "custom" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Select on map
          </button>
        </div>

        {pickupMode === "preset" ? (
          <div className="space-y-2">
            <Select
              onValueChange={(value) => {
                const selectedOffice = PRESET_OFFICES.find(
                  (o) => o.address === value,
                );
                if (selectedOffice) {
                  setValue("pickupLocation", selectedOffice.address, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent side="top">
                {PRESET_OFFICES.map((office) => (
                  <SelectItem key={office.id} value={office.address}>
                    {`${office.name} (${office.address})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border text-sm">
            <span className="truncate pr-2 text-gray-700">
              {pickupAddress || "Point is not selected"}
            </span>
            <button
              type="button"
              onClick={() => setIsPickupMapOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 shrink-0"
            >
              Open a map
            </button>
          </div>
        )}
      </div>
      <FieldError
        className="mb-4"
        errors={[{ message: errors.pickupLocation?.message }]}
      />
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          id="sameAsPickup"
          name="same-location"
          checked={sameAsPickup}
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          onCheckedChange={(checked) => setSameAsPickup(checked === true)}
        />
        <Label htmlFor="sameAsPickup">Drop off place is the same</Label>
      </div>

      {!sameAsPickup && (
        <div className="space-y-3 bg-white p-4 rounded-xl border">
          <label className="block text-sm font-semibold text-gray-800">
            Where to return a car?
          </label>

          <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setReturnMode("preset")}
              className={`py-1.5 text-xs font-medium rounded-md transition ${returnMode === "preset" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              Our office
            </button>
            <button
              type="button"
              onClick={() => {
                setReturnMode("custom");
                setIsReturnMapOpen(true);
              }}
              className={`py-1.5 text-xs font-medium rounded-md transition ${returnMode === "custom" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              Select on map
            </button>
          </div>

          {returnMode === "preset" ? (
            <div className="space-y-2">
              {PRESET_OFFICES.map((office) => {
                const isSelected = returnAddress === office.address;
                return (
                  <div
                    key={office.id}
                    onClick={() =>
                      setValue("dropoffLocation", office.address, {
                        shouldValidate: true,
                      })
                    }
                    className={`p-2.5 rounded-lg border cursor-pointer text-sm flex justify-between items-center transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50"
                        : "hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {office.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {office.address}
                      </div>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}
                    >
                      {isSelected && (
                        <div className="w-1 h-1 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border text-sm">
              <span className="truncate pr-2 text-gray-700">
                {returnAddress || "Point is not selected"}
              </span>
              <button
                type="button"
                onClick={() => setIsReturnMapOpen(true)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 shrink-0"
              >
                Open a map
              </button>
            </div>
          )}
        </div>
      )}
      <DeliveryMapModal
        offices={PRESET_OFFICES}
        isOpen={isPickupMapOpen}
        onClose={() => setIsPickupMapOpen(false)}
        fieldName="pickupLocation"
      />
      <DeliveryMapModal
        offices={PRESET_OFFICES}
        isOpen={isReturnMapOpen}
        onClose={() => setIsReturnMapOpen(false)}
        fieldName="dropoffLocation"
      />
    </div>
  );
}
