import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  themes, type Theme, type InsertTheme
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private themes: Map<number, Theme>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentThemeId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.themes = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentThemeId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add initial categories
    const categoryData: InsertCategory[] = [
      { name: "All", slug: "all" },
      { name: "Material", slug: "material" },
      { name: "Dark", slug: "dark" },
      { name: "Minimal", slug: "minimal" },
      { name: "Colorful", slug: "colorful" },
      { name: "Aesthetic", slug: "aesthetic" },
      { name: "Minimalist", slug: "minimalist" }
    ];
    
    const categories = categoryData.map(cat => this.createCategory(cat));
    
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
        isFeatured: true,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: true,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: false,
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
        isFeatured: false,
        isTopRated: true,
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
        isFeatured: false,
        isTopRated: true,
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
        isFeatured: false,
        isTopRated: true,
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
        isFeatured: false,
        isTopRated: true,
        releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
        categoryId: 4
      }
    ];
    
    themeData.forEach(theme => this.createTheme(theme));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Theme methods
  async getAllThemes(): Promise<Theme[]> {
    return Array.from(this.themes.values());
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    return this.themes.get(id);
  }
  
  async getThemesByCategory(categoryId: number): Promise<Theme[]> {
    if (categoryId === 1) { // "All" category
      return this.getAllThemes();
    }
    
    return Array.from(this.themes.values()).filter(
      (theme) => theme.categoryId === categoryId,
    );
  }
  
  async getThemesByIds(ids: number[]): Promise<Theme[]> {
    return ids.map(id => this.themes.get(id)).filter(Boolean) as Theme[];
  }
  
  async getFeaturedThemes(): Promise<Theme[]> {
    return Array.from(this.themes.values()).filter(
      (theme) => theme.isFeatured,
    );
  }
  
  async getTopRatedThemes(limit: number = 10): Promise<Theme[]> {
    return Array.from(this.themes.values())
      .filter(theme => theme.isTopRated || theme.rating >= 4.8)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  
  async getNewReleases(limit: number = 10): Promise<Theme[]> {
    return Array.from(this.themes.values())
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime())
      .slice(0, limit);
  }
  
  async getTrendingThemes(limit: number = 10): Promise<Theme[]> {
    return Array.from(this.themes.values())
      .sort((a, b) => (b.ratingCount * b.rating) - (a.ratingCount * a.rating))
      .slice(0, limit);
  }
  
  async searchThemes(query: string): Promise<Theme[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.themes.values()).filter(
      (theme) => 
        theme.name.toLowerCase().includes(lowerQuery) ||
        theme.description.toLowerCase().includes(lowerQuery) ||
        theme.author.toLowerCase().includes(lowerQuery)
    );
  }
  
  async createTheme(insertTheme: InsertTheme): Promise<Theme> {
    const id = this.currentThemeId++;
    const theme: Theme = { ...insertTheme, id };
    this.themes.set(id, theme);
    return theme;
  }
}

export const storage = new MemStorage();
