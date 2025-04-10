import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-themes";
import StarRating from "@/components/ui/star-rating";
import ThemeInstallationSteps from "@/components/themes/ThemeInstallationSteps";
import ThemeOptionsMenu from "@/components/layout/ThemeOptionsMenu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function ThemeDetails() {
  const [_, navigate] = useLocation();
  const [match, params] = useRoute('/theme/:id');
  const themeId = params ? parseInt(params.id) : 0;
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  
  const { data: theme, isLoading, error } = useTheme(themeId);
  
  const handleAddToFavorites = () => {
    setLiked(!liked);
    
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked 
        ? `${theme?.name} has been removed from your favorites.`
        : `${theme?.name} has been added to your favorites.`,
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Theme shared",
      description: "Link copied to clipboard!",
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback. Our team will review this theme.",
      variant: "destructive"
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your theme will be downloaded shortly.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen pb-16">
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
        
        <BottomNavigation />
      </div>
    );
  }
  
  if (error || !theme) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-5 pb-20">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h2 className="text-xl font-bold mb-2">Theme Not Found</h2>
        <p className="text-gray-400 mb-4 text-center">Sorry, we couldn't load this theme or it doesn't exist.</p>
        <Button 
          className="bg-purple-700 hover:bg-purple-600"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
        
        <BottomNavigation />
      </div>
    );
  }
  
  // Format the release date to a readable format
  const releaseDate = new Date(theme.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      <div className="h-64 relative">
        <img 
          src={theme.imageUrl} 
          alt={theme.name} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-center px-4 py-2">
            <button 
              className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white"
              onClick={() => navigate("/")}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <ThemeOptionsMenu
              theme={theme}
              onShare={handleShare}
              onAddToFavorites={handleAddToFavorites}
              onReport={handleReport}
            />
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold">{theme.name}</h2>
            <p className="text-sm text-gray-400">By {theme.author}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.isFree ? 'bg-emerald-900/50 text-emerald-400' : 'bg-pink-900/50 text-pink-400'}`}>
            {theme.isFree ? 'Free' : `$${theme.price.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <StarRating rating={theme.rating} count={theme.ratingCount} />
          <span className="text-gray-400 text-xs ml-3">
            <i className="fas fa-download mr-1"></i>
            {theme.ratingCount > 1000 
              ? `${(theme.ratingCount / 1000).toFixed(1)}k` 
              : theme.ratingCount} downloads
          </span>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-gray-800 mb-4">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="previews" className="flex-1">Previews</TabsTrigger>
            <TabsTrigger value="install" className="flex-1">Installation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="mb-4">
              <p className="text-sm text-gray-200 leading-relaxed">{theme.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Release Date</p>
                  <p className="text-sm font-medium">{releaseDate}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Version</p>
                  <p className="text-sm font-medium">1.0.0</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Size</p>
                  <p className="text-sm font-medium">12.5 MB</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Style</p>
                  <p className="text-sm font-medium">Modern</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="previews">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {theme.previewImages.map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-2 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="install">
            <ThemeInstallationSteps />
          </TabsContent>
        </Tabs>
        
        <div className="flex space-x-3 mt-6">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 py-3 rounded-full text-white font-medium"
            onClick={handleDownload}
          >
            <i className="fas fa-download mr-2"></i>
            Download Theme
          </Button>
          <Button 
            className="w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full p-0"
            onClick={handleAddToFavorites}
          >
            <i className={`${liked ? 'fas text-red-400' : 'far'} fa-heart text-lg`}></i>
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
