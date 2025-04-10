import { apiRequest } from "./queryClient";
import { Theme, Category } from "@shared/schema";

// Theme API service
export const themeService = {
  // Get all themes
  async getAllThemes(): Promise<Theme[]> {
    const response = await apiRequest("GET", "/api/themes");
    return response.json();
  },
  
  // Get a theme by ID
  async getThemeById(id: number): Promise<Theme> {
    const response = await apiRequest("GET", `/api/themes/${id}`);
    return response.json();
  },
  
  // Get themes by category
  async getThemesByCategory(categoryId: number): Promise<Theme[]> {
    const response = await apiRequest("GET", `/api/themes/category/${categoryId}`);
    return response.json();
  },
  
  // Get featured themes
  async getFeaturedThemes(): Promise<Theme[]> {
    const response = await apiRequest("GET", "/api/themes/featured");
    return response.json();
  },
  
  // Get top rated themes
  async getTopRatedThemes(limit: number = 4): Promise<Theme[]> {
    const response = await apiRequest("GET", `/api/themes/top-rated?limit=${limit}`);
    return response.json();
  },
  
  // Get new releases
  async getNewReleases(limit: number = 3): Promise<Theme[]> {
    const response = await apiRequest("GET", `/api/themes/new-releases?limit=${limit}`);
    return response.json();
  },
  
  // Get trending themes
  async getTrendingThemes(limit: number = 4): Promise<Theme[]> {
    const response = await apiRequest("GET", `/api/themes/trending?limit=${limit}`);
    return response.json();
  },
  
  // Search themes
  async searchThemes(query: string): Promise<Theme[]> {
    const response = await apiRequest("GET", `/api/themes/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }
};

// Category API service
export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    const response = await apiRequest("GET", "/api/categories");
    return response.json();
  }
};
