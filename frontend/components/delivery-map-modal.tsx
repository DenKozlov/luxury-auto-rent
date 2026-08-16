"use client";

import { useState } from "react";
import { Map, AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useFormContext } from "react-hook-form";
import { Office } from "@/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import OfficeMapInfo from "./office-map-info";
import getAddress from "@/services/geocoding.service";
import { useQuery } from "@tanstack/react-query";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  offices: Office[];
}

const DUBAI_BOUNDS = {
  north: 25.35,
  south: 24.8,
  west: 54.85,
  east: 56.13,
};

const DUBAI_CENTER = {
  lat: 25.276987,
  lng: 55.296249,
};

export function DeliveryMapModal({
  isOpen,
  onClose,
  fieldName,
  offices,
}: MapModalProps) {
  const { setValue } = useFormContext();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  const {
    data: address,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["geocoding", position],
    queryFn: () => getAddress(position),
    enabled: !!position,
    staleTime: 1000 * 60 * 60,
  });

  if (!isOpen) return null;

  const handleMapClick = async (event: MapMouseEvent) => {
    if (!event.detail.latLng) return;
    const newLat = event.detail.latLng.lat;
    const newLng = event.detail.latLng.lng;
    setPosition({ lat: newLat, lng: newLng });
    setSelectedOffice(null);
  };

  const handleConfirm = () => {
    setValue(fieldName, address, { shouldValidate: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-base font-semibold text-gray-800">
            Select the place (Dubai)
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 rounded-full hover:text-gray-600 font-bold cursor-pointer w-8 h-8"
          >
            <X />
          </Button>
        </div>

        <div className="flex-1 w-full relative">
          <Map
            defaultZoom={13}
            gestureHandling="greedy"
            defaultCenter={DUBAI_CENTER}
            onClick={handleMapClick}
            restriction={{ latLngBounds: DUBAI_BOUNDS, strictBounds: true }}
            mapId="free-map-id"
          >
            {offices.map((office) => (
              <AdvancedMarker
                key={office.id}
                position={{ lat: office.lat, lng: office.lng }}
                onClick={(e) => {
                  console.log(e);
                  e.stopPropagation();
                  setSelectedOffice(office);
                }}
              >
                <div className="bg-green-700 text-white p-2 w-10 h-10 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                  🏢
                </div>
              </AdvancedMarker>
            ))}
          </Map>
          {selectedOffice && (
            <OfficeMapInfo
              setSelectedOffice={setSelectedOffice}
              selectedOffice={selectedOffice}
            />
          )}
        </div>

        <div className="p-4 border-t bg-white flex justify-between items-center gap-4">
          <div className="text-xs text-gray-600 truncate max-w-md">
            <span className="font-medium text-gray-900">Selected: </span>
            {address}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-sm text-blackfont-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
