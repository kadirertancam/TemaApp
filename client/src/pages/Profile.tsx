import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Profile() {
  const [_, setLocation] = useLocation();
  
  // Mock user data - in a real app, this would come from an API/context
  const isLoggedIn = false;
  
  // Mock data for downloads and favorites - in a real app, these would be API calls
  const downloadedThemes = [];
  const favoriteThemes = [];
  
  const handleBackClick = () => {
    setLocation("/");
  };
  
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
          <button className="p-2 rounded-full hover:bg-gray-700">
            <i className="fas fa-cog text-white"></i>
          </button>
        </div>
      </header>
      
      <main className="pt-20 pb-20 px-4">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-700 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            JD
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-gray-400 text-sm">john.doe@example.com</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Premium Membership</h3>
            <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Access to all premium themes until May 10, 2025</p>
          <Button className="w-full mt-3 bg-purple-700 hover:bg-purple-600 text-sm">
            Manage Subscription
          </Button>
        </div>
        
        <Tabs defaultValue="downloads" className="w-full">
          <TabsList className="w-full bg-gray-800">
            <TabsTrigger value="downloads" className="flex-1">Downloads</TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloads" className="mt-4">
            {downloadedThemes.length === 0 ? (
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
            ) : (
              <div>
                {/* Downloaded themes list would go here */}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            {favoriteThemes.length === 0 ? (
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
            ) : (
              <div>
                {/* Favorite themes list would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
}