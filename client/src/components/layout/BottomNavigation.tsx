import React, { useState } from "react";
import { useLocation } from "wouter";

interface NavigationItem {
  name: string;
  icon: string;
  path: string;
}

export function BottomNavigation() {
  const [location, setLocation] = useLocation();
  
  const navItems: NavigationItem[] = [
    { name: "Home", icon: "fas fa-home", path: "/" },
    { name: "Categories", icon: "fas fa-th-large", path: "/categories" },
    { name: "Search", icon: "fas fa-search", path: "/search" },
    { name: "Profile", icon: "fas fa-user", path: "/profile" }
  ];
  
  const handleNavigation = (path: string) => {
    setLocation(path);
  };
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <a 
            key={item.name}
            href="#"
            className={`bottom-nav-item flex flex-col items-center py-2 px-4 ${
              isActive(item.path) ? 'text-purple-700 active' : 'text-gray-400'
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.path);
            }}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span className="text-xs mt-1">{item.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigation;
