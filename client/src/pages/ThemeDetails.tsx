import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-themes";
import StarRating from "@/components/ui/star-rating";
import ThemeInstallationSteps from "@/components/themes/ThemeInstallationSteps";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThemeDetails() {
  const [_, navigate] = useLocation();
  const [match, params] = useRoute('/theme/:id');
  const themeId = params ? parseInt(params.id) : 0;
  
  const { data: theme, isLoading, error } = useTheme(themeId);
  
  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="h-64 bg-gray-800 relative">
          <Skeleton className="w-full h-full" />
          <button 
            className="absolute top-4 left-4 h-10 w-10 bg-black/50 rounded-full flex items-center justify-center text-white"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        
        <div className="p-5">
          <Skeleton className="h-8 w-2/3 mb-2 bg-gray-800" />
          <Skeleton className="h-5 w-1/3 mb-4 bg-gray-800" />
          
          <Skeleton className="h-4 w-full mb-6 bg-gray-800" />
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Skeleton className="aspect-w-1 aspect-h-2 rounded-lg bg-gray-800" />
            <Skeleton className="aspect-w-1 aspect-h-2 rounded-lg bg-gray-800" />
            <Skeleton className="aspect-w-1 aspect-h-2 rounded-lg bg-gray-800" />
          </div>
          
          <Skeleton className="h-40 w-full rounded-lg mb-4 bg-gray-800" />
          
          <div className="flex space-x-3">
            <Skeleton className="flex-1 h-12 rounded-full bg-gray-800" />
            <Skeleton className="w-12 h-12 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !theme) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-5">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h2 className="text-xl font-bold mb-2">Theme Not Found</h2>
        <p className="text-gray-400 mb-4 text-center">Sorry, we couldn't load this theme or it doesn't exist.</p>
        <Button 
          className="bg-purple-700 hover:bg-purple-600"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="h-64 relative">
        <img 
          src={theme.imageUrl} 
          alt={theme.name} 
          className="w-full h-full object-cover"
        />
        
        <button 
          className="absolute top-4 left-4 h-10 w-10 bg-black/50 rounded-full flex items-center justify-center text-white"
          onClick={() => navigate("/")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
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
    </div>
  );
}
