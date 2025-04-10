import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Theme } from "@shared/schema";
import StarRating from "@/components/ui/star-rating";
import ThemeInstallationSteps from "./ThemeInstallationSteps";

interface ThemePreviewModalProps {
  theme: Theme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemePreviewModal({ theme, open, onOpenChange }: ThemePreviewModalProps) {
  if (!theme) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700 p-0 max-h-[90vh] overflow-y-auto">
        <div className="h-64 overflow-hidden relative">
          <img 
            src={theme.imageUrl} 
            alt={`${theme.name} Preview`} 
            className="w-full h-full object-cover"
          />
          
          <DialogClose className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white">
            <i className="fas fa-times"></i>
          </DialogClose>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-bold">{theme.name}</h2>
              <p className="text-sm text-gray-400">By {theme.author}</p>
            </div>
            <span className={theme.isFree ? 'text-emerald-400' : 'text-pink-400'}>
              {theme.isFree ? 'Free' : `$${theme.price.toFixed(2)}`}
            </span>
          </div>
          
          <div className="flex items-center mb-4">
            <StarRating rating={theme.rating} count={theme.ratingCount} />
          </div>
          
          <p className="text-sm mb-4">{theme.description}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {theme.previewImages.slice(0, 3).map((image, index) => (
              <div key={index} className="aspect-w-1 aspect-h-2 rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <ThemeInstallationSteps />
          
          <div className="flex space-x-3">
            <Button className="flex-1 bg-purple-700 hover:bg-purple-600 py-3 rounded-full text-white font-medium">
              Download
            </Button>
            <Button className="w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full p-0">
              <i className="far fa-heart text-lg"></i>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ThemePreviewModal;
