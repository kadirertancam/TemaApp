import React, { useState } from "react";
import { useLocation } from "wouter";
import { Theme } from "@shared/schema";
import StarRating from "@/components/ui/star-rating";

interface FeaturedThemeCarouselProps {
  themes: Theme[];
}

export function FeaturedThemeCarousel({ themes }: FeaturedThemeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [_, setLocation] = useLocation();
  
  if (!themes || themes.length === 0) {
    return null;
  }
  
  const currentTheme = themes[currentIndex];
  
  const handleInstallClick = (e: React.MouseEvent, themeId: number) => {
    e.stopPropagation();
    setLocation(`/theme/${themeId}`);
  };
  
  const handlePreviewClick = (e: React.MouseEvent, themeId: number) => {
    e.stopPropagation();
    setLocation(`/theme/${themeId}`);
  };
  
  const handleThemeClick = () => {
    setLocation(`/theme/${currentTheme.id}`);
  };
  
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-white">Featured Themes</h2>
      
      <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={handleThemeClick}>
        <div className="aspect-w-16 aspect-h-9 relative">
          <img 
            src={currentTheme.imageUrl} 
            alt={`${currentTheme.name} Preview`} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center mb-1">
              <h3 className="text-xl font-bold text-white mr-2">{currentTheme.name}</h3>
              <span className="bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full">FEATURED</span>
            </div>
            
            <div className="flex items-center mb-3">
              <StarRating rating={currentTheme.rating} count={currentTheme.ratingCount} />
            </div>
            
            <p className="text-sm text-white/90 mb-4">{currentTheme.description}</p>
            
            <div className="flex space-x-3">
              <button 
                className="bg-purple-700 px-4 py-2 rounded-full text-white text-sm font-medium flex items-center"
                onClick={(e) => handleInstallClick(e, currentTheme.id)}
              >
                <i className="fas fa-download mr-2"></i> Install
              </button>
              
              <button 
                className="bg-gray-700 px-4 py-2 rounded-full text-white text-sm font-medium flex items-center"
                onClick={(e) => handlePreviewClick(e, currentTheme.id)}
              >
                <i className="fas fa-eye mr-2"></i> Preview
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-1">
          {themes.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 bg-white rounded-full ${index === currentIndex ? 'opacity-100' : 'opacity-30'}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedThemeCarousel;
