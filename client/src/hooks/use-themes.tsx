import { useQuery } from "@tanstack/react-query";
import { themeService, categoryService } from "@/lib/theme-service";
import { Theme, Category } from "@shared/schema";

// Hook for getting all categories
export function useCategories() {
  return useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      return await categoryService.getAllCategories();
    }
  });
}

// Hook for getting a theme by ID
export function useTheme(id: number) {
  return useQuery({
    queryKey: ['/api/themes', id],
    queryFn: async () => {
      return await themeService.getThemeById(id);
    },
    enabled: !!id
  });
}

// Hook for getting featured themes
export function useFeaturedThemes() {
  return useQuery({
    queryKey: ['/api/themes/featured'],
    queryFn: async () => {
      return await themeService.getFeaturedThemes();
    }
  });
}

// Hook for getting trending themes
export function useTrendingThemes(limit: number = 4) {
  return useQuery({
    queryKey: ['/api/themes/trending', limit],
    queryFn: async () => {
      return await themeService.getTrendingThemes(limit);
    }
  });
}

// Hook for getting new releases
export function useNewReleases(limit: number = 3) {
  return useQuery({
    queryKey: ['/api/themes/new-releases', limit],
    queryFn: async () => {
      return await themeService.getNewReleases(limit);
    }
  });
}

// Hook for getting top rated themes
export function useTopRatedThemes(limit: number = 4) {
  return useQuery({
    queryKey: ['/api/themes/top-rated', limit],
    queryFn: async () => {
      return await themeService.getTopRatedThemes(limit);
    }
  });
}

// Hook for getting themes by category or search
export function useFilteredThemes(categoryId: number, searchQuery: string = "") {
  return useQuery({
    queryKey: ['/api/themes/filtered', categoryId, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return await themeService.searchThemes(searchQuery);
      } else if (categoryId) {
        return await themeService.getThemesByCategory(categoryId);
      } else {
        return await themeService.getAllThemes();
      }
    }
  });
}
