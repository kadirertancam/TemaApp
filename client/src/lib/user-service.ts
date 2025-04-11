import { apiRequest } from "./queryClient";
import { Theme, User } from "@shared/schema";

// User API service
export const userService = {
  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiRequest("GET", "/api/user/profile");
      if (!response.ok) {
        if (response.status === 401) {
          console.log("User not authenticated");
          return null;
        }
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },
  
  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiRequest("PUT", "/api/user/profile", userData);
    return response.json();
  },
  
  // Get user's favorite themes
  async getFavorites(): Promise<Theme[]> {
    const response = await apiRequest("GET", "/api/user/favorites");
    return response.json();
  },
  
  // Add a theme to favorites
  async addToFavorites(themeId: number): Promise<void> {
    await apiRequest("POST", "/api/user/favorites", { themeId });
  },
  
  // Remove a theme from favorites
  async removeFromFavorites(themeId: number): Promise<void> {
    await apiRequest("DELETE", `/api/user/favorites/${themeId}`);
  },
  
  // Get user's downloaded themes
  async getDownloads(): Promise<Theme[]> {
    const response = await apiRequest("GET", "/api/user/downloads");
    return response.json();
  },
  
  // Record a theme download
  async recordDownload(themeId: number): Promise<void> {
    await apiRequest("POST", "/api/user/downloads", { themeId });
  },
  
  // Get user's purchased themes
  async getPurchases(): Promise<Theme[]> {
    const response = await apiRequest("GET", "/api/user/purchases");
    return response.json();
  },
  
  // Purchase a theme
  async purchaseTheme(themeId: number): Promise<void> {
    await apiRequest("POST", "/api/user/purchases", { themeId });
  },

  // Get user's subscription status
  async getSubscription(): Promise<{ 
    isPremium: boolean, 
    expiryDate: string | null, 
    plan: string | null 
  }> {
    const response = await apiRequest("GET", "/api/user/subscription");
    return response.json();
  },
  
  // Log out user
  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  }
};
