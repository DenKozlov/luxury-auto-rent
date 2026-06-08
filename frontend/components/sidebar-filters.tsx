"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { MultiSelect } from "./ui/multi-select";
import { carService } from "@/services/car.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

const SidebarFilters = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const { data: filters, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => carService.getFilters(),
  });
  console.log(filters);
  return (
    <Card className="w-80 h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Filters</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Reset
        </Button>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-120px)] pr-4">
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Car Type</h4>
            <div className="space-y-2">
              {["SUV", "Sedan", "Coupe", "Convertible"].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <label
                      htmlFor={type}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">(12)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Brand</h4>
            {isLoading ? (
              <Skeleton className="w-full h-10" />
            ) : (
              <MultiSelect
                options={filters.brands}
                selected={selectedBrands}
                onChange={setSelectedBrands}
              />
            )}
          </div>

          {/* Блок 3: Слайдер цены */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Price Range (per day)</h4>
            <Slider defaultValue={[150, 400]} max={500} step={10} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$500+</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Automatic Transmission</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available Now</span>
              <Switch />
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default SidebarFilters;
