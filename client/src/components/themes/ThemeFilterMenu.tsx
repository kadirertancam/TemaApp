import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface ThemeFilterMenuProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  sortBy: "relevance" | "popularity" | "newest" | "rating" | "downloads" | "price-low" | "price-high";
  priceRange: [number, number];
  onlyFree: boolean;
  colorScheme: "any" | "dark" | "light" | "colorful";
}

export function ThemeFilterMenu({ onApplyFilters }: ThemeFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: "relevance",
    priceRange: [0, 10],
    onlyFree: false,
    colorScheme: "any"
  });
  
  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value as FilterOptions["sortBy"]
    });
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    });
  };
  
  const handleFreeOnlyChange = (checked: boolean) => {
    setFilters({
      ...filters,
      onlyFree: checked
    });
  };
  
  const handleColorSchemeChange = (value: string) => {
    setFilters({
      ...filters,
      colorScheme: value as FilterOptions["colorScheme"]
    });
  };
  
  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };
  
  const handleReset = () => {
    const defaultFilters = {
      sortBy: "relevance" as const,
      priceRange: [0, 10] as [number, number],
      onlyFree: false,
      colorScheme: "any" as const
    };
    
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <i className="fas fa-sliders-h"></i>
          Filters
          <div className="w-5 h-5 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center ml-1">
            {Object.values(filters).filter(v => 
              v !== false && 
              v !== "any" && 
              !(Array.isArray(v) && v[0] === 0 && v[1] === 10) &&
              v !== "popularity"
            ).length}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-800 text-white border-gray-700 w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Filter Themes</SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Sort By</h3>
            <RadioGroup 
              value={filters.sortBy} 
              onValueChange={handleSortChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relevance" id="relevance" className="border-gray-600 text-purple-600" />
                <Label htmlFor="relevance" className="text-white cursor-pointer">Relevance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popularity" id="popularity" className="border-gray-600 text-purple-600" />
                <Label htmlFor="popularity" className="text-white cursor-pointer">Most Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="downloads" id="downloads" className="border-gray-600 text-purple-600" />
                <Label htmlFor="downloads" className="text-white cursor-pointer">Most Downloaded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" className="border-gray-600 text-purple-600" />
                <Label htmlFor="newest" className="text-white cursor-pointer">Newest First</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="rating" className="border-gray-600 text-purple-600" />
                <Label htmlFor="rating" className="text-white cursor-pointer">Highest Rated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="price-low" className="border-gray-600 text-purple-600" />
                <Label htmlFor="price-low" className="text-white cursor-pointer">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="price-high" className="border-gray-600 text-purple-600" />
                <Label htmlFor="price-high" className="text-white cursor-pointer">Price: High to Low</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Price Range</h3>
              <div className="text-sm text-gray-400">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
            <Slider 
              defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
              max={10} 
              step={0.5} 
              onValueChange={handlePriceRangeChange}
              className="mt-6"
            />
            <div className="flex items-center justify-between mt-6">
              <Label htmlFor="free-only" className="text-sm font-medium cursor-pointer">
                Free themes only
              </Label>
              <Switch 
                id="free-only" 
                checked={filters.onlyFree}
                onCheckedChange={handleFreeOnlyChange}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Color Scheme</h3>
            <RadioGroup 
              value={filters.colorScheme} 
              onValueChange={handleColorSchemeChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" className="border-gray-600 text-purple-600" />
                <Label htmlFor="any" className="text-white cursor-pointer">Any</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" className="border-gray-600 text-purple-600" />
                <Label htmlFor="dark" className="text-white cursor-pointer">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" className="border-gray-600 text-purple-600" />
                <Label htmlFor="light" className="text-white cursor-pointer">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="colorful" id="colorful" className="border-gray-600 text-purple-600" />
                <Label htmlFor="colorful" className="text-white cursor-pointer">Colorful</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex space-x-3 mt-8">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button 
              className="flex-1 bg-purple-700 hover:bg-purple-600"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ThemeFilterMenu;