import React from "react";
import { useLocation } from "wouter";
import StarRating from "@/components/ui/star-rating";
import { Theme } from "@shared/schema";

interface ThemeListItemProps {
  theme: Theme;
  isNew?: boolean;
}

export function ThemeListItem({ theme, isNew = false }: ThemeListItemProps) {
  const [_, setLocation] = useLocation();
  
  const handleClick = () => {
    setLocation(`/theme/${theme.id}`);
  };
  
  // Format the release date to "X days ago"
  const daysAgo = Math.floor((Date.now() - new Date(theme.releaseDate).getTime()) / (1000 * 60 * 60 * 24));
  const releaseDateText = `Released ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  
  return (
    <div 
      className="flex bg-gray-800 rounded-xl overflow-hidden shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-20 h-20 flex-shrink-0">
        <img 
          src={theme.thumbnailUrl} 
          alt={theme.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-white">{theme.name}</h3>
            <p className="text-xs text-gray-400">{releaseDateText}</p>
          </div>
          <span className={`text-xs ${theme.isFree ? 'text-emerald-400' : 'text-pink-400'} font-medium`}>
            {theme.isFree ? 'Free' : `$${theme.price.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            {isNew ? (
              <div className="flex">
                <i className="fas fa-star text-yellow-400 text-xs"></i>
                <span className="text-xs text-gray-400 ml-1">New</span>
              </div>
            ) : (
              <StarRating rating={theme.rating} count={theme.ratingCount} small={true} />
            )}
          </div>
          
          <button 
            className="text-xs bg-purple-700 text-white px-3 py-1 rounded-full"
            onClick={(e) => { 
              e.stopPropagation();
              setLocation(`/theme/${theme.id}`);
            }}
          >
            Get
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeListItem;
