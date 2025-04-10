import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

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
