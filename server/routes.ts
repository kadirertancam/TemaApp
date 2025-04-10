import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({ username, email, password: hashedPassword });
      res.json({ user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const bcrypt = await import('bcrypt');
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all themes
  app.get("/api/themes", async (_req, res) => {
    try {
      const themes = await storage.getAllThemes();
      res.json(themes);
    } catch (error) {
      console.error("Error fetching all themes:", error);
      res.status(500).json({ message: "Failed to fetch themes" });
    }
  });
  
  // Get featured themes
  app.get("/api/themes/featured", async (_req, res) => {
    try {
      const themes = await storage.getFeaturedThemes();
      res.json(themes);
    } catch (error) {
      console.error("Error fetching featured themes:", error);
      res.status(500).json({ message: "Failed to fetch featured themes" });
    }
  });

  // Get top rated themes
  app.get("/api/themes/top-rated", async (req, res) => {
    try {
      const limitSchema = z.coerce.number().min(1).optional().default(10);
      const limit = limitSchema.parse(req.query.limit);
      const themes = await storage.getTopRatedThemes(limit);
      res.json(themes);
    } catch (error) {
      console.error("Error fetching top rated themes:", error);
      res.status(500).json({ message: "Failed to fetch top rated themes" });
    }
  });

  // Get new releases
  app.get("/api/themes/new-releases", async (req, res) => {
    try {
      const limitSchema = z.coerce.number().min(1).optional().default(10);
      const limit = limitSchema.parse(req.query.limit);
      const themes = await storage.getNewReleases(limit);
      res.json(themes);
    } catch (error) {
      console.error("Error fetching new releases:", error);
      res.status(500).json({ message: "Failed to fetch new releases" });
    }
  });

  // Get trending themes
  app.get("/api/themes/trending", async (req, res) => {
    try {
      const limitSchema = z.coerce.number().min(1).optional().default(10);
      const limit = limitSchema.parse(req.query.limit);
      const themes = await storage.getTrendingThemes(limit);
      res.json(themes);
    } catch (error) {
      console.error("Error fetching trending themes:", error);
      res.status(500).json({ message: "Failed to fetch trending themes" });
    }
  });

  // Search themes
  app.get("/api/themes/search", async (req, res) => {
    try {
      const querySchema = z.string().min(1);
      const query = querySchema.parse(req.query.q);
      const themes = await storage.searchThemes(query);
      res.json(themes);
    } catch (error) {
      console.error("Error searching themes:", error);
      res.status(500).json({ message: "Failed to search themes" });
    }
  });

  // Get themes by category
  app.get("/api/themes/category/:categoryId", async (req, res) => {
    try {
      const categoryIdSchema = z.coerce.number().min(1);
      const categoryId = categoryIdSchema.parse(req.params.categoryId);
      const themes = await storage.getThemesByCategory(categoryId);
      res.json(themes);
    } catch (error) {
      console.error("Error fetching themes by category:", error);
      res.status(500).json({ message: "Failed to fetch themes by category" });
    }
  });

  // Get theme by ID - THIS MUST BE LAST as it's the most generic route
  app.get("/api/themes/:id", async (req, res) => {
    try {
      const idSchema = z.coerce.number().min(1);
      const id = idSchema.parse(req.params.id);
      const theme = await storage.getThemeById(id);
      
      if (!theme) {
        return res.status(404).json({ message: "Theme not found" });
      }
      
      res.json(theme);
    } catch (error) {
      console.error("Error fetching theme by ID:", error);
      res.status(500).json({ message: "Failed to fetch theme" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
