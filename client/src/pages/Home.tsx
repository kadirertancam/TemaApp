import React, { useState, useEffect } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FeaturedThemeCarousel from "@/components/themes/FeaturedThemeCarousel";
import ThemeCard from "@/components/themes/ThemeCard";
import ThemeListItem from "@/components/themes/ThemeListItem";
import WhatsNewDialog from "@/components/layout/WhatsNewDialog";
import FloatingActionButton from "@/components/ui/floating-action-button";
import { useCategories, useFeaturedThemes, useTrendingThemes, useNewReleases, useTopRatedThemes, useFilteredThemes } from "@/hooks/use-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOptions } from "@/components/themes/ThemeFilterMenu";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All" category
  const [searchQuery, setSearchQuery] = useState("");
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Fetch data
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredThemes = [], isLoading: featuredLoading } = useFeaturedThemes();
  const { data: trendingThemes = [], isLoading: trendingLoading } = useTrendingThemes(4);
  const { data: newReleases = [], isLoading: newReleasesLoading } = useNewReleases(3);
  const { data: topRatedThemes = [], isLoading: topRatedLoading } = useTopRatedThemes(4);
  const { data: filteredThemes = [], isLoading: filteredLoading } = useFilteredThemes(
    searchQuery ? 0 : selectedCategory,
    searchQuery
  );
  
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSearchQuery(""); // Clear search when changing category
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (filters: FilterOptions) => {
    toast({
      title: "Filters applied",
      description: `Showing ${filters.onlyFree ? 'free' : 'all'} themes, sorted by ${filters.sortBy}`,
    });
  };
  
  // FAB actions
  const fabItems = [
    {
      icon: "fas fa-filter",
      label: "Filter",
      color: "bg-indigo-700",
      onClick: () => {
        // This would normally show the filter menu
        toast({
          title: "Filter themes",
          description: "Filter dialog would open here.",
        });
      }
    },
    {
      icon: "fas fa-th-large",
      label: "Categories",
      color: "bg-pink-700",
      onClick: () => setLocation("/categories")
    },
    {
      icon: "fas fa-star",
      label: "Top Rated",
      color: "bg-amber-700",
      onClick: () => setLocation("/top-rated")
    },
    {
      icon: "fas fa-bell",
      label: "What's New",
      color: "bg-purple-700",
      onClick: () => setWhatsNewOpen(true)
    }
  ];
  
  // Content based on filters
  const displayedThemes = searchQuery ? filteredThemes : null;
  
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
        {/* Show search results if searching */}
        {searchQuery ? (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Search Results</h2>
            
            {filteredLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                    <Skeleton className="aspect-w-9 aspect-h-16 bg-gray-700" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                      <Skeleton className="h-4 w-1/2 bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedThemes && displayedThemes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {displayedThemes.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-search text-4xl text-gray-500 mb-2"></i>
                <p className="text-gray-400">No themes found for "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Featured Themes */}
            {featuredLoading ? (
              <section className="mb-8">
                <Skeleton className="h-7 w-40 bg-gray-800 mb-3" />
                <Skeleton className="aspect-w-16 aspect-h-9 rounded-2xl bg-gray-800" />
              </section>
            ) : (
              <FeaturedThemeCarousel themes={featuredThemes} />
            )}
            
            {/* Trending Themes */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Trending Now</h2>
                <a href="#" className="text-emerald-400 text-sm">See all</a>
              </div>
              
              {trendingLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                      <Skeleton className="aspect-w-9 aspect-h-16 bg-gray-700" />
                      <div className="p-3">
                        <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                        <Skeleton className="h-4 w-1/2 bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {trendingThemes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} />
                  ))}
                </div>
              )}
            </section>
            
            {/* New Releases */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">New Releases</h2>
                <a href="#" className="text-emerald-400 text-sm">See all</a>
              </div>
              
              {newReleasesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex bg-gray-800 rounded-xl overflow-hidden shadow-md">
                      <Skeleton className="w-20 h-20 bg-gray-700" />
                      <div className="p-3 flex-1">
                        <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                        <Skeleton className="h-4 w-1/2 bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {newReleases.map((theme) => (
                    <ThemeListItem key={theme.id} theme={theme} isNew={true} />
                  ))}
                </div>
              )}
            </section>
            
            {/* Top Rated */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Top Rated</h2>
                <a href="#" className="text-emerald-400 text-sm">See all</a>
              </div>
              
              {topRatedLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                      <Skeleton className="aspect-w-9 aspect-h-16 bg-gray-700" />
                      <div className="p-3">
                        <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                        <Skeleton className="h-4 w-1/2 bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {topRatedThemes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} topRated={true} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      
      <FloatingActionButton items={fabItems} />
      <WhatsNewDialog open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />
      <BottomNavigation />
    </div>
  );
}
