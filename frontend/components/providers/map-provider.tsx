"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

interface MapProviderProps {
  children: React.ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="text-red-500">Error: Google Maps API key is missing</div>
    );
  }

  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
