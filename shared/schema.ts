import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  price: real("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(true),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  previewImages: text("preview_images").array().notNull(),
  rating: real("rating").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTopRated: boolean("is_top_rated").notNull().default(false),
  releaseDate: timestamp("release_date").notNull().defaultNow(),
  categoryId: integer("category_id").notNull(),
});

export const insertThemeSchema = createInsertSchema(themes).pick({
  name: true,
  description: true,
  author: true,
  price: true,
  isFree: true,
  imageUrl: true,
  thumbnailUrl: true,
  previewImages: true,
  rating: true,
  ratingCount: true,
  isFeatured: true,
  isTopRated: true,
  releaseDate: true,
  categoryId: true,
});

export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof themes.$inferSelect;
