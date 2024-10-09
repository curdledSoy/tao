import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, } from "drizzle-orm/sqlite-core";

// Users Table
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    bio: text("bio"),
    profilePicture: text("profile_picture"),
    createdAt: integer("created_at", { mode:"timestamp" }).notNull().default(sql`(unixepoch())`),
    private: integer("is_private", { mode: "boolean" }),
});

// Recipes Table
export const recipes = sqliteTable("recipes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").references(() => users.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    instructions: text("instructions").notNull(),
    servings: integer("servings"),
    cookTime: integer("cook_time"),  // Time in minutes
    imageUrl: text("image_url"),
    isDraft: integer("is_draft", { mode: "boolean" }),
    createdAt: integer("created_at", { mode:"timestamp" }).notNull().default(sql`(unixepoch())`),
    publishedOn: integer("published_on", { mode: "timestamp" })
});

// Ingredients Table
export const ingredients = sqliteTable("ingredients", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
});

// Recipe Ingredients (Junction Table)
export const recipeIngredients = sqliteTable("recipe_ingredients", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
    ingredientId: integer("ingredient_id").references(() => ingredients.id).notNull(),
    quantity: text("quantity").notNull(), // E.g., "2 cups"
});

// Comments Table
export const comments = sqliteTable("comments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").references(() => users.id).notNull(),
    recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
    comment: text("comment").notNull(),
    createdAt: integer("created_at", { mode:"timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Likes Table
export const likes = sqliteTable("likes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").references(() => users.id).notNull(),
    recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
    createdAt: integer("created_at", { mode:"timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Follows Table
export const follows = sqliteTable("follows", {
    followerId: integer("follower_id").references(() => users.id).notNull(),
    followingId: integer("following_id").references(() => users.id).notNull(),
    createdAt: integer("created_at", { mode:"timestamp" }).notNull().default(sql`(unixepoch())`),
});
