import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

type PriceRangeProps = {
  min: number;
  max: number;
  step?: number;
  withInputs?: boolean;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  isLoading: boolean;
};

export const PriceRange = ({
  min,
  max,
  step = 100,
  withInputs,
  value,
  onChange,
  isLoading,
}: PriceRangeProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{min} PLN</span>
        <span>{max} PLN</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange([v[0], v[1]])}
      />
      {withInputs && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              Min
            </label>
            <Input
              type="number"
              step={step}
              min={min}
              max={value[1]}
              value={value[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= min && v <= value[1]) {
                  onChange([v, value[1]]);
                }
              }}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              Max
            </label>
            <Input
              type="number"
              step={step}
              min={value[0]}
              max={max}
              value={value[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= value[0] && v <= max) {
                  onChange([value[0], v]);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
