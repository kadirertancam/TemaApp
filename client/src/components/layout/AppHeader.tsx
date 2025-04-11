import React, { useState } from "react";
import { useLocation } from "wouter";
import { Category } from "@shared/schema";
import SideMenu from "./SideMenu";
import ThemeFilterMenu, { FilterOptions } from "../themes/ThemeFilterMenu";

interface AppHeaderProps {
  categories: Category[];
  currentCategory: number;
  onCategoryChange: (categoryId: number) => void;
  onSearch: (query: string) => void;
  onFilter?: (filters: FilterOptions) => void;
}

export function AppHeader({ 
  categories, 
  currentCategory, 
  onCategoryChange, 
  onSearch,
  onFilter
}: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    
    // Navigate to search page with query
    if (searchQuery.trim()) {
      setLocation(`/search/${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation('/search');
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Debounce search as user types
    if (e.target.value === "") {
      onSearch("");
    }
  };
  
  const handleCategoryClick = (categoryId: number) => {
    onCategoryChange(categoryId);
  };
  
  const goHome = () => {
    setLocation("/");
  };

  const handleFilterApply = (filters: FilterOptions) => {
    if (onFilter) {
      onFilter(filters);
    }
  };
  
  return (
    <>
      <SideMenu isOpen={sideMenuOpen} onOpenChange={setSideMenuOpen} />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              className="w-8 h-8 mr-2 rounded-full hover:bg-gray-700 flex items-center justify-center"
              onClick={() => setSideMenuOpen(true)}
            >
              <i className="fas fa-bars text-white"></i>
            </button>
            <h1 
              className="text-xl font-semibold text-white cursor-pointer"
              onClick={goHome}
            >
              ThemeHub
            </h1>
            <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">PRO</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <i className="fas fa-bell text-white"></i>
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-700"
              onClick={() => setLocation("/profile")}
            >
              <i className="fas fa-user text-white"></i>
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search themes" 
                className="w-full bg-gray-700 text-white py-2 px-4 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </form>
            
            {onFilter && (
              <ThemeFilterMenu onApplyFilters={handleFilterApply} />
            )}
          </div>
        </div>
        
        {categories.length > 0 && (
          <div className="pb-2 px-2 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            <div className="flex space-x-2 py-1">
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className={`category-pill px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                    currentCategory === category.id ? 'bg-purple-700' : 'bg-gray-700'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default AppHeader;
