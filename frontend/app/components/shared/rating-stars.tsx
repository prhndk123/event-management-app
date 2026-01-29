import { Star } from 'lucide-react';
import { cn } from '~/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < rating;
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            className={cn(
              "focus:outline-none transition-colors",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-warning text-warning"
                  : "fill-muted text-muted-foreground"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
