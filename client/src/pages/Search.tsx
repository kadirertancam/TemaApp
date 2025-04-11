import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ThemeCard from "@/components/themes/ThemeCard";
import { useCategories, useFilteredThemes } from "@/hooks/use-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOptions } from "@/components/themes/ThemeFilterMenu";
import { useToast } from "@/hooks/use-toast";
import { Theme } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Search() {
  // Get search query from URL
  const [_, params] = useRoute("/search/:query?");
  const initialQuery = params?.query ? decodeURIComponent(params.query) : "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All" category
  const [sortBy, setSortBy] = useState("relevance");
  const [onlyFree, setOnlyFree] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch data
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: searchResults = [], isLoading: searchLoading } = useFilteredThemes(
    0, // We'll filter by category client-side
    searchQuery
  );

  // Filter and sort results client-side
  const filteredResults = React.useMemo(() => {
    let results = [...searchResults];
    
    // Filter by category if not "All"
    if (selectedCategory > 1) {
      results = results.filter(theme => theme.categoryId === selectedCategory);
    }
    
    // Filter by price
    if (onlyFree) {
      results = results.filter(theme => theme.isFree);
    }
    
    // Sort results
    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "downloads":
        results.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      // Default is relevance (as returned by the server)
    }
    
    return results;
  }, [searchResults, selectedCategory, onlyFree, sortBy]);
  
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL with search query for easy sharing
    if (query) {
      setLocation(`/search/${encodeURIComponent(query)}`);
    } else {
      setLocation("/search");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };
  
  const handleFilter = (filters: FilterOptions) => {
    setSortBy(filters.sortBy);
    setOnlyFree(filters.onlyFree);
    
    toast({
      title: "Filters applied",
      description: `Showing ${filters.onlyFree ? 'free' : 'all'} themes, sorted by ${filters.sortBy}`,
    });
  };
  
  // Update URL when search changes
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AppHeader 
        categories={categories} 
        currentCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
      
      <main className="pt-36 pb-20 px-4">
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search themes"
              className="flex-1 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <Button 
              variant="default" 
              className="bg-purple-700 hover:bg-purple-600"
              onClick={() => handleSearch(searchQuery)}
            >
              <i className="fas fa-search mr-2"></i>
              Search
            </Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-md font-semibold mb-3">Advanced Filters</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select 
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="free-only" 
                  checked={onlyFree}
                  onCheckedChange={setOnlyFree}
                />
                <Label htmlFor="free-only">Free Themes Only</Label>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Themes'}
            </h2>
            <span className="text-sm text-gray-400">
              {filteredResults.length} themes found
            </span>
          </div>
          
          {searchLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                  <Skeleton className="aspect-w-9 aspect-h-16 bg-gray-700" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                    <Skeleton className="h-4 w-1/2 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredResults.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-xl">
              <i className="fas fa-search text-6xl text-gray-600 mb-3"></i>
              <p className="text-xl text-gray-400 mb-2">No themes found</p>
              <p className="text-gray-500">
                {searchQuery 
                  ? `Try different keywords or filters` 
                  : `Use the search field above to find themes`}
              </p>
            </div>
          )}
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
