import { pgTable, text, serial, integer, boolean, timestamp, real, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  downloads: many(userDownloads),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  isPremium: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name"),
  colorClass: text("color_class"),
  displayOrder: integer("display_order").default(0),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  themes: many(themes),
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  iconName: true,
  colorClass: true,
  displayOrder: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Themes table
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
  downloadCount: integer("download_count").default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTopRated: boolean("is_top_rated").notNull().default(false),
  isTrending: boolean("is_trending").default(false),
  version: text("version").default("1.0.0"),
  fileSize: text("file_size").default("0 MB"),
  style: text("style"),
  releaseDate: timestamp("release_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  categoryId: integer("category_id").notNull().references(() => categories.id),
});

export const themesRelations = relations(themes, ({ one, many }) => ({
  category: one(categories, {
    fields: [themes.categoryId],
    references: [categories.id],
  }),
  favorites: many(userFavorites),
  downloads: many(userDownloads),
}));

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
  downloadCount: true,
  isFeatured: true,
  isTopRated: true,
  isTrending: true,
  version: true,
  fileSize: true,
  style: true,
  releaseDate: true,
  categoryId: true,
});

export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof themes.$inferSelect;

// User favorites junction table
export const userFavorites = pgTable("user_favorites", {
  userId: integer("user_id").notNull().references(() => users.id),
  themeId: integer("theme_id").notNull().references(() => themes.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.themeId] }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [userFavorites.themeId],
    references: [themes.id],
  }),
}));

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).pick({
  userId: true,
  themeId: true,
});

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// User downloads junction table
export const userDownloads = pgTable("user_downloads", {
  userId: integer("user_id").notNull().references(() => users.id),
  themeId: integer("theme_id").notNull().references(() => themes.id),
  downloadDate: timestamp("download_date").notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.themeId] }),
}));

export const userDownloadsRelations = relations(userDownloads, ({ one }) => ({
  user: one(users, {
    fields: [userDownloads.userId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [userDownloads.themeId],
    references: [themes.id],
  }),
}));

export const insertUserDownloadSchema = createInsertSchema(userDownloads).pick({
  userId: true,
  themeId: true,
});

export type InsertUserDownload = z.infer<typeof insertUserDownloadSchema>;
export type UserDownload = typeof userDownloads.$inferSelect;
