import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CarCardSkeleton = () => {
  return (
    <Card className="pt-0 w-80 min-w-80 h-96 bg-[#1c1c1e] border border-[#2c2c2e]">
      <div className="relative w-full h-56">
        <Skeleton className="w-full h-full" />
      </div>
      <Separator />
      <CardContent>
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCardSkeleton;
