import React from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  small?: boolean;
  className?: string;
  showCount?: boolean;
}

export function StarRating({ 
  rating, 
  count, 
  small = false, 
  className,
  showCount = true 
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const textSize = small ? "text-xs" : "text-sm";
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className={`fas fa-star text-yellow-400 ${textSize}`}></i>
        ))}
        
        {hasHalfStar && (
          <i className={`fas fa-star-half-alt text-yellow-400 ${textSize}`}></i>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className={`fas fa-star text-gray-600 ${textSize}`}></i>
        ))}
      </div>
      
      {showCount && count !== undefined && (
        <span className={`text-gray-400 ml-1 ${textSize}`}>
          {small ? rating : `${rating} (${count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})`}
        </span>
      )}
    </div>
  );
}

export default StarRating;
