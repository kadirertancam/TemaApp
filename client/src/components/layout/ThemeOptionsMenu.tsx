import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Theme } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ThemeOptionsMenuProps {
  theme: Theme;
  onShare?: () => void;
  onAddToFavorites?: () => void;
  onReport?: () => void;
}

export function ThemeOptionsMenu({ 
  theme, 
  onShare, 
  onAddToFavorites, 
  onReport 
}: ThemeOptionsMenuProps) {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default sharing behavior
      if (navigator.share) {
        navigator.share({
          title: theme.name,
          text: `Check out this amazing theme: ${theme.name}`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
      }
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
          <i className="fas fa-ellipsis-v"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
        <DropdownMenuLabel className="text-gray-400">Theme Options</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer" 
          onClick={handleShare}
        >
          <i className="fas fa-share-alt mr-2"></i>
          <span>Share Theme</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer" 
          onClick={onAddToFavorites}
        >
          <i className="fas fa-heart mr-2"></i>
          <span>Add to Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
        >
          <i className="fas fa-download mr-2"></i>
          <span>Download Now</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-gray-700 focus:bg-gray-700 hover:text-red-400 focus:text-red-400 cursor-pointer" 
          onClick={onReport}
        >
          <i className="fas fa-flag mr-2"></i>
          <span>Report Issue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeOptionsMenu;