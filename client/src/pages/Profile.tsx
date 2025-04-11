import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ProfileSubscription from "@/components/profile/ProfileSubscription";
import ProfileThemeItem from "@/components/profile/ProfileThemeItem";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites, useDownloads, usePurchases } from "@/hooks/use-user-themes";

export default function Profile() {
  const [_, setLocation] = useLocation();
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const { data: favorites = [], isLoading: favoritesLoading } = useFavorites();
  const { data: downloads = [], isLoading: downloadsLoading } = useDownloads();
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchases();
  
  const handleBackClick = () => {
    setLocation("/");
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  if (authLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                onClick={handleBackClick}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 className="text-xl font-semibold text-white ml-4">Profile</h1>
            </div>
            <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
          </div>
        </header>
        
        <main className="pt-20 pb-20 px-4">
          <div className="flex items-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full bg-gray-800" />
            <div className="ml-4">
              <Skeleton className="h-6 w-32 bg-gray-800 mb-2" />
              <Skeleton className="h-4 w-48 bg-gray-800" />
            </div>
          </div>
          
          <Skeleton className="h-32 w-full bg-gray-800 rounded-xl mb-6" />
          
          <Skeleton className="h-12 w-full bg-gray-800 rounded-lg mb-4" />
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-gray-800 rounded-xl" />
            ))}
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
          <div className="flex items-center px-4 py-3">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              onClick={handleBackClick}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-xl font-semibold text-white ml-4">Profile</h1>
          </div>
        </header>
        
        <main className="pt-20 pb-20 px-4 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl text-gray-400 mx-auto mb-6">
              <i className="fas fa-user"></i>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Sign in to ThemeHub</h2>
            <p className="text-gray-400 mb-8">
              Track your favorite themes, manage downloads, and sync across devices.
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-purple-700 hover:bg-purple-600"
                onClick={() => setLocation("/login")}
              >
                Sign In
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-purple-700 text-purple-400 hover:bg-purple-800 hover:text-white"
                onClick={() => setLocation("/register")}
              >
                Create Account
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              onClick={handleBackClick}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-xl font-semibold text-white ml-4">Profile</h1>
          </div>
          <ProfileSettings />
        </div>
      </header>
      
      <main className="pt-20 pb-20 px-4">
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 bg-gradient-to-tr from-purple-700 to-pink-500">
            <AvatarFallback>{getInitials(user?.displayName || user?.username || '')}</AvatarFallback>
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          </Avatar>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{user?.displayName || user?.username}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {user?.bio && <p className="text-gray-300 text-sm mt-1">{user.bio}</p>}
          </div>
        </div>
        
        <ProfileSubscription />
        
        <Tabs defaultValue="downloads" className="w-full">
          <TabsList className="w-full bg-gray-800 mb-4">
            <TabsTrigger value="downloads" className="flex-1">
              Downloads
              {downloads.length > 0 && (
                <span className="ml-1 bg-purple-700 text-white text-xs px-1.5 rounded-full">
                  {downloads.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              Favorites
              {favorites.length > 0 && (
                <span className="ml-1 bg-purple-700 text-white text-xs px-1.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1">
              Purchases
              {purchases.length > 0 && (
                <span className="ml-1 bg-purple-700 text-white text-xs px-1.5 rounded-full">
                  {purchases.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloads">
            {downloadsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : downloads.length > 0 ? (
              <div>
                {downloads.map((theme) => (
                  <ProfileThemeItem key={theme.id} theme={theme} type="download" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-2xl text-gray-600"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">No Downloads Yet</h3>
                <p className="text-gray-400 text-sm mb-4">Your downloaded themes will appear here</p>
                <Button 
                  className="bg-purple-700 hover:bg-purple-600"
                  onClick={() => setLocation("/")}
                >
                  Browse Themes
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            {favoritesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div>
                {favorites.map((theme) => (
                  <ProfileThemeItem key={theme.id} theme={theme} type="favorite" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-2xl text-gray-600"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
                <p className="text-gray-400 text-sm mb-4">Your favorite themes will appear here</p>
                <Button 
                  className="bg-purple-700 hover:bg-purple-600"
                  onClick={() => setLocation("/")}
                >
                  Explore Themes
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="purchases">
            {purchasesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : purchases.length > 0 ? (
              <div>
                {purchases.map((theme) => (
                  <ProfileThemeItem key={theme.id} theme={theme} type="purchase" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shopping-cart text-2xl text-gray-600"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">No Purchases Yet</h3>
                <p className="text-gray-400 text-sm mb-4">Themes you purchase will appear here</p>
                <Button 
                  className="bg-purple-700 hover:bg-purple-600"
                  onClick={() => setLocation("/")}
                >
                  Shop Themes
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
