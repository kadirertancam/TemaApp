import React from 'react';
import { Theme } from '@shared/schema';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRemoveFromFavorites } from '@/hooks/use-user-themes';

interface ProfileThemeItemProps {
  theme: Theme;
  type: 'favorite' | 'download' | 'purchase';
  onRemove?: (id: number) => void;
}

export function ProfileThemeItem({ theme, type, onRemove }: ProfileThemeItemProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const handleViewDetails = () => {
    setLocation(`/theme/${theme.id}`);
  };
  
  const handleRemove = () => {
    if (type === 'favorite' && onRemove) {
      removeFromFavorites.mutate(theme.id);
    } else if (onRemove) {
      onRemove(theme.id);
    }
  };
  
  const handleReinstall = () => {
    toast({
      title: 'Installing theme',
      description: `${theme.name} will be installed shortly`,
    });
  };
  
  const formattedDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="flex bg-gray-800 rounded-xl overflow-hidden shadow-md mb-3">
      <div 
        className="w-20 h-20 bg-center bg-cover" 
        style={{ backgroundImage: `url(${theme.thumbnailUrl})` }}
        onClick={handleViewDetails}
      />
      <div className="p-3 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className="font-medium text-white cursor-pointer hover:text-purple-400" 
              onClick={handleViewDetails}
            >
              {theme.name}
            </h3>
            <p className="text-gray-400 text-xs">by {theme.author}</p>
          </div>
          {!theme.isFree && (
            <span className="bg-emerald-800 text-emerald-300 text-xs px-2 py-0.5 rounded-full">
              ${theme.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {type === 'favorite' && 'Added to favorites'}
            {type === 'download' && 'Downloaded'}
            {type === 'purchase' && 'Purchased'}
            {' • '}
            {formattedDate(theme.releaseDate)}
          </div>
          <div className="flex space-x-2">
            {(type === 'download' || type === 'purchase') && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950"
                onClick={handleReinstall}
              >
                <i className="fas fa-download mr-1"></i> Reinstall
              </Button>
            )}
            {type === 'favorite' && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 text-xs text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                onClick={handleRemove}
              >
                <i className="fas fa-heart-broken mr-1"></i> Remove
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-950"
              onClick={handleViewDetails}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileThemeItem;
