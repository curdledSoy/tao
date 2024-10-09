import { defineAuthEventHandler } from '~/server/utils/auth'
import { tables, useDrizzle, eq } from '~/server/utils/database'

export default defineAuthEventHandler(async (event) => {
  const userId = event.context.auth.userId
  const db = useDrizzle()

  const likedRecipes = await db.select({
    id: tables.recipes.id,
    title: tables.recipes.title,
    description: tables.recipes.description,
    imageUrl: tables.recipes.imageUrl,
    userId: tables.recipes.userId,
    author: tables.users.username,
    createdAt: tables.recipes.createdAt,
    likes: sql<number>`(SELECT COUNT(*) FROM ${tables.likes} WHERE ${tables.likes.recipeId} = ${tables.recipes.id})`.as('likes_count'),
  })
  .from(tables.likes)
  .innerJoin(tables.recipes, eq(tables.likes.recipeId, tables.recipes.id))
  .innerJoin(tables.users, eq(tables.recipes.userId, tables.users.id))
  .where(eq(tables.likes.userId, userId))

  return likedRecipes
})
