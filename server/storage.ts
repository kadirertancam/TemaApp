import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  themes, type Theme, type InsertTheme,
  userFavorites, userDownloads
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, or, sql, inArray } from "drizzle-orm";

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Theme methods
  getAllThemes(): Promise<Theme[]>;
  getThemeById(id: number): Promise<Theme | undefined>;
  getThemesByCategory(categoryId: number): Promise<Theme[]>;
  getThemesByIds(ids: number[]): Promise<Theme[]>;
  getFeaturedThemes(): Promise<Theme[]>;
  getTopRatedThemes(limit?: number): Promise<Theme[]>;
  getNewReleases(limit?: number): Promise<Theme[]>;
  getTrendingThemes(limit?: number): Promise<Theme[]>;
  searchThemes(query: string): Promise<Theme[]>;
  createTheme(theme: InsertTheme): Promise<Theme>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database with sample data when needed
    this.initializeDb();
  }

  private async initializeDb() {
    try {
      // Check if we already have categories
      const existingCategories = await this.getAllCategories();
      
      // Only seed data if no categories exist
      if (existingCategories.length === 0) {
        console.log("Initializing database with sample data...");
        
        // Add initial categories
        const categoryData: InsertCategory[] = [
          { name: "All", slug: "all", description: "All themes", iconName: "grid", colorClass: "bg-primary" },
          { name: "Material", slug: "material", description: "Material design themes", iconName: "circle", colorClass: "bg-blue-500" },
          { name: "Dark", slug: "dark", description: "Dark mode themes", iconName: "moon", colorClass: "bg-gray-900" },
          { name: "Minimal", slug: "minimal", description: "Minimalist designs", iconName: "square", colorClass: "bg-slate-500" },
          { name: "Colorful", slug: "colorful", description: "Vibrant colorful themes", iconName: "palette", colorClass: "bg-purple-500" },
          { name: "Aesthetic", slug: "aesthetic", description: "Artistic aesthetic themes", iconName: "image", colorClass: "bg-pink-500" },
          { name: "Minimalist", slug: "minimalist", description: "Clean minimalist designs", iconName: "minus-square", colorClass: "bg-zinc-700" }
        ];
        
        // Create categories
        const createdCategories = await Promise.all(categoryData.map(cat => this.createCategory(cat)));
        
        // Add initial themes
        const themeData: InsertTheme[] = [
          {
            name: "NeonWave Pro",
            description: "Modern neon-inspired theme with dynamic icon pack and animated wallpapers",
            author: "ThemeHub Studios",
            price: 0,
            isFree: true,
            imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
            thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
            previewImages: [
              "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
              "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
              "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e"
            ],
            rating: 4.7,
            ratingCount: 2300,
            downloadCount: 12500,
            isFeatured: true,
            isTopRated: false,
            isTrending: true,
            version: "2.1.0",
            fileSize: "24.6 MB",
            style: "Neon",
            releaseDate: new Date(),
            categoryId: 1
          },
          {
            name: "Minimal Dark",
            description: "Clean, minimal dark theme with dynamic icon pack and sleek interface elements. Optimized for AMOLED screens and battery life.",
            author: "ThemeHub Studios",
            price: 0,
            isFree: true,
            imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd",
            thumbnailUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd",
            previewImages: [
              "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd",
              "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd",
              "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd"
            ],
            rating: 4.0,
            ratingCount: 2300,
            downloadCount: 9800,
            isFeatured: false,
            isTopRated: false,
            isTrending: false,
            version: "1.5.2",
            fileSize: "18.3 MB",
            style: "Dark",
            releaseDate: new Date(),
            categoryId: 3
          },
          {
            name: "Material You",
            description: "Official Material You design theme with dynamic color adaptation",
            author: "Material Design Team",
            price: 0,
            isFree: true,
            imageUrl: "https://images.unsplash.com/photo-1508614999368-9260051292e5",
            thumbnailUrl: "https://images.unsplash.com/photo-1508614999368-9260051292e5",
            previewImages: [
              "https://images.unsplash.com/photo-1508614999368-9260051292e5",
              "https://images.unsplash.com/photo-1508614999368-9260051292e5",
              "https://images.unsplash.com/photo-1508614999368-9260051292e5"
            ],
            rating: 5.0,
            ratingCount: 10000,
            downloadCount: 45000,
            isFeatured: false,
            isTopRated: true,
            isTrending: true,
            version: "3.1.4",
            fileSize: "15.2 MB",
            style: "Material",
            releaseDate: new Date(),
            categoryId: 2
          }
        ];
        
        // Create themes
        await Promise.all(themeData.map(theme => this.createTheme(theme)));
        console.log("Database initialization complete.");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    try {
      const allCategories = await db.select().from(categories).orderBy(categories.displayOrder);
      return allCategories;
    } catch (error) {
      console.error("Error getting all categories:", error);
      return [];
    }
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      return category;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      return undefined;
    }
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
      return category;
    } catch (error) {
      console.error("Error getting category by slug:", error);
      return undefined;
    }
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(insertCategory).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
  
  // Theme methods
  async getAllThemes(): Promise<Theme[]> {
    try {
      const allThemes = await db.select().from(themes);
      return allThemes;
    } catch (error) {
      console.error("Error getting all themes:", error);
      return [];
    }
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    try {
      const [theme] = await db.select().from(themes).where(eq(themes.id, id));
      return theme;
    } catch (error) {
      console.error("Error getting theme by ID:", error);
      return undefined;
    }
  }
  
  async getThemesByCategory(categoryId: number): Promise<Theme[]> {
    try {
      if (categoryId === 1) { // "All" category
        return this.getAllThemes();
      }
      
      const themesByCategory = await db.select().from(themes).where(eq(themes.categoryId, categoryId));
      return themesByCategory;
    } catch (error) {
      console.error("Error getting themes by category:", error);
      return [];
    }
  }
  
  async getThemesByIds(ids: number[]): Promise<Theme[]> {
    try {
      if (ids.length === 0) return [];
      
      const themesByIds = await db.select().from(themes).where(
        inArray(themes.id, ids)
      );
      return themesByIds;
    } catch (error) {
      console.error("Error getting themes by IDs:", error);
      return [];
    }
  }
  
  async getFeaturedThemes(): Promise<Theme[]> {
    try {
      const featuredThemes = await db.select().from(themes).where(eq(themes.isFeatured, true));
      return featuredThemes;
    } catch (error) {
      console.error("Error getting featured themes:", error);
      return [];
    }
  }
  
  async getTopRatedThemes(limit: number = 10): Promise<Theme[]> {
    try {
      const topRatedThemes = await db
        .select()
        .from(themes)
        .where(eq(themes.isTopRated, true))
        .orderBy(desc(themes.rating))
        .limit(limit);
      return topRatedThemes;
    } catch (error) {
      console.error("Error getting top rated themes:", error);
      return [];
    }
  }
  
  async getNewReleases(limit: number = 10): Promise<Theme[]> {
    try {
      const newReleases = await db
        .select()
        .from(themes)
        .orderBy(desc(themes.releaseDate))
        .limit(limit);
      return newReleases;
    } catch (error) {
      console.error("Error getting new releases:", error);
      return [];
    }
  }
  
  async getTrendingThemes(limit: number = 10): Promise<Theme[]> {
    try {
      const trendingThemes = await db
        .select()
        .from(themes)
        .where(eq(themes.isTrending, true))
        .orderBy(desc(themes.downloadCount))
        .limit(limit);
      return trendingThemes;
    } catch (error) {
      console.error("Error getting trending themes:", error);
      return [];
    }
  }
  
  async searchThemes(query: string): Promise<Theme[]> {
    try {
      if (!query) return this.getAllThemes();
      
      const searchQuery = `%${query.toLowerCase()}%`;
      const searchResults = await db
        .select()
        .from(themes)
        .where(
          or(
            like(themes.name, searchQuery),
            like(themes.description, searchQuery),
            like(themes.author, searchQuery)
          )
        );
      return searchResults;
    } catch (error) {
      console.error("Error searching themes:", error);
      return [];
    }
  }
  
  async createTheme(insertTheme: InsertTheme): Promise<Theme> {
    try {
      const [theme] = await db.insert(themes).values(insertTheme).returning();
      return theme;
    } catch (error) {
      console.error("Error creating theme:", error);
      throw error;
    }
  }
}

// Export storage instance
export const storage = new DatabaseStorage();