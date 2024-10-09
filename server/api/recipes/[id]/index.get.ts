import { desc } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const db = useDrizzle()

  const recipe = await db.select({
    id: tables.recipes.id,
    title: tables.recipes.title,
    description: tables.recipes.description,
    instructions: tables.recipes.instructions,
    servings: tables.recipes.servings,
    cookTime: tables.recipes.cookTime,
    imageUrl: tables.recipes.imageUrl,
    userId: tables.recipes.userId,
    author: tables.users.username,
    likes: sql<number>`(SELECT COUNT(*) FROM ${tables.likes} WHERE ${tables.likes.recipeId} = ${tables.recipes.id})`.as('likes_count'),
  })
  .from(tables.recipes)
  .innerJoin(tables.users, eq(tables.recipes.userId, tables.users.id))
  .where(eq(tables.recipes.id, parseInt(id)))
  .limit(1)

  if (!recipe[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found',
    })
  }

  const ingredients = await db.select({
    id: tables.recipeIngredients.id,
    name: tables.ingredients.name,
    quantity: tables.recipeIngredients.quantity,
  })
  .from(tables.recipeIngredients)
  .innerJoin(tables.ingredients, eq(tables.recipeIngredients.ingredientId, tables.ingredients.id))
  .where(eq(tables.recipeIngredients.recipeId, parseInt(id)))

  const comments = await db.select({
    id: tables.comments.id,
    content: tables.comments.comment,
    author: tables.users.username,
    createdAt: tables.comments.createdAt,
  })
  .from(tables.comments)
  .innerJoin(tables.users, eq(tables.comments.userId, tables.users.id))
  .where(eq(tables.comments.recipeId, parseInt(id)))
  .orderBy(desc(tables.comments.createdAt))

  return { ...recipe[0], ingredients, comments }
})