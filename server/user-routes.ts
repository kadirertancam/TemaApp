import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    // Get user ID from cookie
    const userId = req.cookies?.userId;
    
    if (!userId) {
      // For development, fallback to a demo user
      const users = await storage.getAllUsers();
      if (users.length > 0) {
        // Use the first user as a demo
        req.user = users[0];
        console.log("Using demo user for authentication:", req.user.username);
        return next();
      }
      return res.status(401).json({ message: "Unauthorized - Please login" });
    }
    
    const user = await storage.getUser(parseInt(userId));
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

export function registerUserRoutes(app: Express) {
  // Debug route - get current auth status
  app.get("/api/auth/status", async (req, res) => {
    try {
      const userId = req.cookies?.userId;
      
      if (!userId) {
        return res.json({
          authenticated: false,
          message: "No user ID in cookie"
        });
      }
      
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.json({
          authenticated: false,
          message: "User not found"
        });
      }
      
      return res.json({
        authenticated: true,
        userId: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Error checking auth status:", error);
      return res.status(500).json({ message: "Failed to check auth status" });
    }
  });

  // Get current user profile
  app.get("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      // User is already attached from middleware
      const user = req.user;
      
      // Return user data without password
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  // Update user profile
  app.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Validate update data
      const updateSchema = z.object({
        displayName: z.string().optional(),
        email: z.string().email().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedUser = await storage.updateUser(userId, updateData);
      
      // Return user data without password
      const { password, ...userData } = updatedUser;
      res.json(userData);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Get user's favorite themes
  app.get("/api/user/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const favoriteThemes = await storage.getFavoriteThemes(userId);
      res.json(favoriteThemes);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  
  // Add a theme to favorites
  app.post("/api/user/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const bodySchema = z.object({
        themeId: z.number(),
      });
      
      const { themeId } = bodySchema.parse(req.body);
      await storage.addToFavorites(userId, themeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });
  
  // Remove a theme from favorites
  app.delete("/api/user/favorites/:themeId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const paramsSchema = z.object({
        themeId: z.coerce.number(),
      });
      
      const { themeId } = paramsSchema.parse(req.params);
      await storage.removeFromFavorites(userId, themeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });
  
  // Get user's downloaded themes
  app.get("/api/user/downloads", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const downloadedThemes = await storage.getDownloadedThemes(userId);
      res.json(downloadedThemes);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      res.status(500).json({ message: "Failed to fetch downloads" });
    }
  });
  
  // Record a theme download
  app.post("/api/user/downloads", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const bodySchema = z.object({
        themeId: z.number(),
      });
      
      const { themeId } = bodySchema.parse(req.body);
      await storage.recordDownload(userId, themeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ message: "Failed to record download" });
    }
  });
  
  // Get user's purchased themes
  app.get("/api/user/purchases", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      // For demo purposes, we'll use some of the theme data
      // In a real app, there would be a separate purchases table
      const purchasedThemes = await storage.getPurchasedThemes(userId);
      res.json(purchasedThemes);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });
  
  // Purchase a theme
  app.post("/api/user/purchases", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const bodySchema = z.object({
        themeId: z.number(),
      });
      
      const { themeId } = bodySchema.parse(req.body);
      await storage.purchaseTheme(userId, themeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error purchasing theme:", error);
      res.status(500).json({ message: "Failed to purchase theme" });
    }
  });
  
  // Get user's subscription status
  app.get("/api/user/subscription", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const subscription = await storage.getUserSubscription(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
}
