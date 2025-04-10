import React, { useState } from "react";
import { useCategories } from "@/hooks/use-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Categories() {
  const [_, setLocation] = useLocation();
  const { data: categories = [], isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (categoryId: number) => {
    // Navigate to home with the selected category
    setLocation(`/?category=${categoryId}`);
  };
  
  const getCategoryIcon = (slug: string) => {
    // Map category slugs to appropriate icons
    const iconMap: Record<string, string> = {
      all: "fas fa-th-large",
      dark: "fas fa-moon",
      light: "fas fa-sun",
      minimal: "fas fa-minus-square",
      colorful: "fas fa-palette",
      material: "fas fa-circle",
      gaming: "fas fa-gamepad",
      nature: "fas fa-leaf",
      abstract: "fas fa-bezier-curve",
    };
    
    return iconMap[slug] || "fas fa-layer-group";
  };
  
  const getCategoryColor = (index: number) => {
    // Array of color classes for category cards
    const colors = [
      "from-purple-800 to-blue-600",
      "from-pink-500 to-rose-600",
      "from-emerald-500 to-teal-700",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-blue-600",
      "from-fuchsia-600 to-pink-600",
      "from-lime-500 to-green-600",
      "from-blue-600 to-indigo-700",
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AppHeader 
        categories={[]} // Hide category pills in header on this page
        currentCategory={0}
        onCategoryChange={() => {}}
        onSearch={handleSearch}
      />
      
      <main className="pt-32 pb-20 px-4">
        <h1 className="text-2xl font-bold mb-6">All Categories</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map((category, index) => (
              <div 
                key={category.id}
                className={`category-card rounded-xl overflow-hidden cursor-pointer h-28 relative bg-gradient-to-br ${getCategoryColor(index)}`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                    <i className={`${getCategoryIcon(category.slug)} text-white text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}