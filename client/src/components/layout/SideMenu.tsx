import React from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SideMenu({ isOpen, onOpenChange }: SideMenuProps) {
  const [location, setLocation] = useLocation();
  
  const menuItems = [
    { name: "Home", icon: "fas fa-home", path: "/" },
    { name: "Categories", icon: "fas fa-th-large", path: "/categories" },
    { name: "Top Rated", icon: "fas fa-star", path: "/top-rated" },
    { name: "New Releases", icon: "fas fa-bolt", path: "/new-releases" },
    { name: "Trending", icon: "fas fa-chart-line", path: "/trending" },
    { name: "Favorites", icon: "fas fa-heart", path: "/favorites" },
  ];
  
  const supportItems = [
    { name: "Settings", icon: "fas fa-cog", path: "/settings" },
    { name: "Help & Support", icon: "fas fa-question-circle", path: "/support" },
    { name: "About", icon: "fas fa-info-circle", path: "/about" },
  ];
  
  const handleNavigation = (path: string) => {
    setLocation(path);
    onOpenChange(false); // Close menu after navigation
  };
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 bg-gray-800 p-0 border-r border-gray-700">
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gray-900">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-700 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                TH
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-white">ThemeHub</h3>
                <p className="text-xs text-gray-400">Personalize your Android</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto py-4">
            <div className="px-3">
              <h2 className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 mb-2">
                Discover
              </h2>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={`w-full justify-start text-base ${
                      isActive(item.path) 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-4 bg-gray-700" />
            
            <div className="px-3">
              <h2 className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 mb-2">
                Support
              </h2>
              <div className="space-y-1">
                {supportItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-base text-gray-400 hover:bg-gray-700 hover:text-white"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="outline"
              className="w-full border-purple-600 text-purple-400 hover:bg-purple-800 hover:text-white"
              onClick={() => handleNavigation("/profile")}
            >
              <i className="fas fa-user mr-2"></i>
              Sign In
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SideMenu;