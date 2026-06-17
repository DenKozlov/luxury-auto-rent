"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "./ui/multi-select";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceRange } from "./ui/price-range";

const filtersSchema = z.object({
  brands: z.array(z.string()),
  bodyTypes: z.array(z.string()),
  priceRange: z
    .tuple([z.number().min(0), z.number().min(0)])
    .refine(([min, max]) => min <= max, {
      message: "Min price must be less than max price",
    }),
  isAvailable: z.boolean(),
});

export type FiltersFormValues = z.infer<typeof filtersSchema>;

interface CarFiltersForm {
  brands: { value: string; count: number }[];
  bodyTypes: { value: string; count: number }[];
  priceRange: [number, number];
  onSubmit: SubmitHandler<FiltersFormValues>;
  onReset?: () => void;
  isLoading: boolean;
}

const CarFiltersForm = ({
  brands,
  bodyTypes,
  priceRange,
  onSubmit,
  onReset,
  isLoading,
}: CarFiltersForm) => {
  const defaultFormValues: FiltersFormValues = {
    brands: [],
    bodyTypes: [],
    isAvailable: true,
    priceRange,
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: defaultFormValues,
  });

  const handleReset = () => {
    reset(defaultFormValues);
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-80 border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Filters</CardTitle>
          <Button size="sm" onClick={handleReset}>
            Reset
          </Button>
        </CardHeader>
        <ScrollArea className="pr-4">
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Body types</h4>
              <Controller
                name="bodyTypes"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={bodyTypes}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select body types"
                    isLoading={isLoading}
                  />
                )}
              />
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Brands</h4>
              <Controller
                name="brands"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={brands}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select brands"
                    isLoading={isLoading}
                    withSearch
                    withSelectAll
                  />
                )}
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Price Range (per day)</h4>
              <Controller
                name="priceRange"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <PriceRange
                      max={priceRange[1]}
                      min={priceRange[0]}
                      step={100}
                      withInputs
                      value={field.value}
                      onChange={field.onChange}
                      isLoading={isLoading}
                    />
                    {errors.priceRange && (
                      <p className="text-xs text-destructive">
                        {errors.priceRange.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available Now</span>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                )}
              />
            </div>
            <Button size="sm">Apply filters</Button>
          </CardContent>
        </ScrollArea>
      </Card>
    </form>
  );
};

export default CarFiltersForm;
