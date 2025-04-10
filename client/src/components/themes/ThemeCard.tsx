import React from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { Theme } from "@shared/schema";

interface ThemeCardProps {
  theme: Theme;
  className?: string;
  hasRating?: boolean;
  showRating?: boolean;
  topRated?: boolean;
}

export function ThemeCard({ 
  theme, 
  className, 
  hasRating = true,
  showRating = true,
  topRated = false
}: ThemeCardProps) {
  const [_, setLocation] = useLocation();
  
  const handleClick = () => {
    setLocation(`/theme/${theme.id}`);
  };
  
  return (
    <div 
      className={cn(
        "theme-card bg-gray-800 rounded-xl overflow-hidden shadow-md transition-transform active:scale-97",
        className
      )}
      onClick={handleClick}
    >
      <div className="aspect-w-9 aspect-h-16 relative">
        <img 
          src={theme.imageUrl} 
          alt={theme.name} 
          className="w-full h-full object-cover"
        />
        
        {topRated && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {theme.rating.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-white">{theme.name}</h3>
          <span className={`text-xs ${theme.isFree ? 'text-emerald-400' : 'text-pink-400'} font-medium`}>
            {theme.isFree ? 'Free' : `$${theme.price.toFixed(2)}`}
          </span>
        </div>
        
        {hasRating && (
          <div className="flex items-center mt-1">
            <StarRating 
              rating={theme.rating} 
              count={showRating ? theme.ratingCount : undefined} 
              small={true} 
              showCount={showRating}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeCard;
