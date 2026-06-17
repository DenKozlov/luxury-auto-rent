import { Star } from "lucide-react";

interface CarRatingProps {
  rating: number; // Сюда передаем car.rating из базы
}

export default function CarRating({ rating }: CarRatingProps) {
  // Округляем до ближайшего целого для закрашивания звезд (например, 5)
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5 font-[var(--font-geist-sans),sans-serif]">
      <div className="flex items-center gap-0.5">
        {[...Array(totalStars)].map((_, index) => {
          const isFilled = index < filledStars;
          return (
            <Star
              key={index}
              className={`w-4 h-4 ${
                isFilled ? "fill-yellow-300" : "text-neutral-700"
              }`}
            />
          );
        })}
      </div>
      <span className="text-2 font-bold tracking-wider">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
