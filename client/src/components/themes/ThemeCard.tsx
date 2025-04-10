import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import ThemeOptionsMenu from "@/components/layout/ThemeOptionsMenu";
import { Theme } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const handleClick = () => {
    setLocation(`/theme/${theme.id}`);
  };
  
  const handleAddToFavorites = () => {
    toast({
      title: "Added to favorites",
      description: `${theme.name} has been added to your favorites.`,
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Theme shared",
      description: `Link copied to clipboard!`,
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback.",
      variant: "destructive"
    });
  };
  
  return (
    <div 
      className={cn(
        "theme-card bg-gray-800 rounded-xl overflow-hidden shadow-md transition-transform active:scale-97 relative group",
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
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <ThemeOptionsMenu
            theme={theme}
            onShare={handleShare}
            onAddToFavorites={handleAddToFavorites}
            onReport={handleReport}
          />
        </div>
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
