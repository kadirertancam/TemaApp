import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  themes, type Theme, type InsertTheme,
  userFavorites, userDownloads
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, inArray, or } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

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
            name: "Neon Flux",
            description: "Vibrant neon theme with eye-catching colors and sleek animations",
            author: "Digital Designers",
            price: 1.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6",
            thumbnailUrl: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6",
            previewImages: [
              "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6",
              "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6",
              "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6"
            ],
            rating: 4.5,
            ratingCount: 750,
            downloadCount: 2400,
            isFeatured: false,
            isTopRated: false,
            isTrending: false,
            version: "1.2.0",
            fileSize: "22.7 MB",
            style: "Neon",
            releaseDate: new Date(),
            categoryId: 4
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
          },
          {
            name: "Cyberpunk",
            description: "Futuristic cyberpunk-inspired theme with neon elements and dark UI",
            author: "Cyber Designs",
            price: 2.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
            thumbnailUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
            previewImages: [
              "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
              "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
              "https://images.unsplash.com/photo-1541701494587-cb58502866ab"
            ],
            rating: 4.2,
            ratingCount: 3200,
            downloadCount: 18600,
            isFeatured: false,
            isTopRated: false,
            isTrending: true,
            version: "2.3.0",
            fileSize: "32.1 MB",
            style: "Futuristic",
            releaseDate: new Date(),
            categoryId: 5
          },
          {
            name: "Gradient Flow",
            description: "Smooth gradient design with flowing UI elements and transitions",
            author: "Gradient Studio",
            price: 1.49,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73",
            thumbnailUrl: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73",
            previewImages: [
              "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73",
              "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73",
              "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73"
            ],
            rating: 0,
            ratingCount: 0,
            downloadCount: 320,
            isFeatured: false,
            isTopRated: false,
            isTrending: false,
            version: "1.0.1",
            fileSize: "19.8 MB",
            style: "Gradient",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            categoryId: 4
          },
          {
            name: "Natural Zen",
            description: "Nature-inspired minimal theme with soothing colors and clean UI",
            author: "Zen Studios",
            price: 0,
            isFree: true,
            imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
            thumbnailUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
            previewImages: [
              "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
              "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
              "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee"
            ],
            rating: 0,
            ratingCount: 0,
            downloadCount: 156,
            isFeatured: false,
            isTopRated: false,
            isTrending: false,
            version: "1.0.0",
            fileSize: "14.2 MB",
            style: "Minimal",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            categoryId: 6
          },
          {
            name: "Tech Wave",
            description: "Tech-inspired theme with futuristic elements and smooth animations",
            author: "Tech Themes",
            price: 0.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945",
            thumbnailUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945",
            previewImages: [
              "https://images.unsplash.com/photo-1604871000636-074fa5117945",
              "https://images.unsplash.com/photo-1604871000636-074fa5117945",
              "https://images.unsplash.com/photo-1604871000636-074fa5117945"
            ],
            rating: 4.5,
            ratingCount: 850,
            downloadCount: 3750,
            isFeatured: false,
            isTopRated: false,
            isTrending: false,
            version: "1.3.2",
            fileSize: "21.5 MB",
            style: "Tech",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
            categoryId: 2
          },
          {
            name: "Flat UI",
            description: "Modern flat UI theme with clean design and vibrant colors",
            author: "Flat Design Co",
            price: 2.49,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
            thumbnailUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
            previewImages: [
              "https://images.unsplash.com/photo-1560807707-8cc77767d783",
              "https://images.unsplash.com/photo-1560807707-8cc77767d783",
              "https://images.unsplash.com/photo-1560807707-8cc77767d783"
            ],
            rating: 5.0,
            ratingCount: 1200,
            downloadCount: 6800,
            isFeatured: false,
            isTopRated: true,
            isTrending: false,
            version: "2.0.0",
            fileSize: "17.3 MB",
            style: "Flat",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
            categoryId: 3
          },
          {
            name: "Aesthetic Pro",
            description: "Beautiful aesthetic theme with pastel colors and artistic elements",
            author: "Aesthetic Designs",
            price: 3.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
            thumbnailUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
            previewImages: [
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e"
            ],
            rating: 4.9,
            ratingCount: 987,
            downloadCount: 5200,
            isFeatured: false,
            isTopRated: true,
            isTrending: false,
            version: "1.8.5",
            fileSize: "28.7 MB",
            style: "Aesthetic",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
            categoryId: 5
          },
          {
            name: "Dark Mode Pro",
            description: "Premium dark theme optimized for AMOLED displays with minimal battery usage",
            author: "Dark Themes",
            price: 1.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9",
            thumbnailUrl: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9",
            previewImages: [
              "https://images.unsplash.com/photo-1604076913837-52ab5629fba9",
              "https://images.unsplash.com/photo-1604076913837-52ab5629fba9",
              "https://images.unsplash.com/photo-1604076913837-52ab5629fba9"
            ],
            rating: 4.9,
            ratingCount: 832,
            downloadCount: 4100,
            isFeatured: false,
            isTopRated: true,
            isTrending: false,
            version: "2.2.1",
            fileSize: "16.2 MB",
            style: "Dark",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
            categoryId: 3
          },
          {
            name: "Neon Glow",
            description: "Vibrant neon theme with glowing elements and dark background",
            author: "Neon Studios",
            price: 2.99,
            isFree: false,
            imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
            thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
            previewImages: [
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
            ],
            rating: 4.8,
            ratingCount: 754,
            downloadCount: 3800,
            isFeatured: false,
            isTopRated: true,
            isTrending: false,
            version: "1.7.3",
            fileSize: "24.9 MB",
            style: "Neon",
            releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
            categoryId: 4
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
      const [user] = await this.db.select().from(users).where(this.eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await this.db.select().from(users).where(this.eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await this.db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    try {
      const allCategories = await this.db.select().from(categories).orderBy(categories.displayOrder);
      return allCategories;
    } catch (error) {
      console.error("Error getting all categories:", error);
      return [];
    }
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    try {
      const [category] = await this.db.select().from(categories).where(this.eq(categories.id, id));
      return category;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      return undefined;
    }
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const [category] = await this.db.select().from(categories).where(this.eq(categories.slug, slug));
      return category;
    } catch (error) {
      console.error("Error getting category by slug:", error);
      return undefined;
    }
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const [category] = await this.db.insert(categories).values(insertCategory).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
  
  // Theme methods
  async getAllThemes(): Promise<Theme[]> {
    try {
      const allThemes = await this.db.select().from(themes);
      return allThemes;
    } catch (error) {
      console.error("Error getting all themes:", error);
      return [];
    }
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    try {
      const [theme] = await this.db.select().from(themes).where(this.eq(themes.id, id));
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
      
      const themesByCategory = await this.db.select().from(themes).where(this.eq(themes.categoryId, categoryId));
      return themesByCategory;
    } catch (error) {
      console.error("Error getting themes by category:", error);
      return [];
    }
  }
  
  async getThemesByIds(ids: number[]): Promise<Theme[]> {
    try {
      if (ids.length === 0) return [];
      
      const themesByIds = await this.db.select().from(themes).where(
        this.db.inArray(themes.id, ids)
      );
      return themesByIds;
    } catch (error) {
      console.error("Error getting themes by IDs:", error);
      return [];
    }
  }
  
  async getFeaturedThemes(): Promise<Theme[]> {
    try {
      const featuredThemes = await this.db.select().from(themes).where(this.eq(themes.isFeatured, true));
      return featuredThemes;
    } catch (error) {
      console.error("Error getting featured themes:", error);
      return [];
    }
  }
  
  async getTopRatedThemes(limit: number = 10): Promise<Theme[]> {
    try {
      const topRatedThemes = await this.db
        .select()
        .from(themes)
        .where(this.eq(themes.isTopRated, true))
        .orderBy(this.desc(themes.rating))
        .limit(limit);
      return topRatedThemes;
    } catch (error) {
      console.error("Error getting top rated themes:", error);
      return [];
    }
  }
  
  async getNewReleases(limit: number = 10): Promise<Theme[]> {
    try {
      const newReleases = await this.db
        .select()
        .from(themes)
        .orderBy(this.desc(themes.releaseDate))
        .limit(limit);
      return newReleases;
    } catch (error) {
      console.error("Error getting new releases:", error);
      return [];
    }
  }
  
  async getTrendingThemes(limit: number = 10): Promise<Theme[]> {
    try {
      const trendingThemes = await this.db
        .select()
        .from(themes)
        .where(this.eq(themes.isTrending, true))
        .orderBy(this.desc(themes.downloadCount))
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
      const searchResults = await this.db
        .select()
        .from(themes)
        .where(
          this.db.or(
            this.like(themes.name, searchQuery),
            this.like(themes.description, searchQuery),
            this.like(themes.author, searchQuery)
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
      const [theme] = await this.db.insert(themes).values(insertTheme).returning();
      return theme;
    } catch (error) {
      console.error("Error creating theme:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
