import { defineAuthEventHandler } from '~/server/utils/auth'
import { tables, useDrizzle, eq } from '~/server/utils/database'

export default defineAuthEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const db = useDrizzle()
  const userId = event.context.auth.userId
  const body = await readBody(event)

  // Validate input
  if (!body.title || !body.instructions) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Title and instructions are required'
    })
  }

  // Check if the recipe belongs to the authenticated user
  const existingRecipe = await db.select().from(tables.recipes)
    .where(eq(tables.recipes.id, parseInt(id)))
    .where(eq(tables.recipes.userId, userId))
    .limit(1)

  if (!existingRecipe[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Recipe not found or you do not have permission to edit it'
    })
  }

  // Update the recipe
  const updatedRecipe = await db.update(tables.recipes)
    .set({
      title: body.title,
      description: body.description,
      instructions: body.instructions,
      servings: body.servings,
      cookTime: body.cookTime,
      imageUrl: body.imageUrl
    })
    .where(eq(tables.recipes.id, parseInt(id)))
    .returning()

  // Update ingredients
  if (body.ingredients && body.ingredients.length > 0) {
    // Delete existing ingredients
    await db.delete(tables.recipeIngredients)
      .where(eq(tables.recipeIngredients.recipeId, parseInt(id)))

    // Insert new ingredients
    for (const ingredient of body.ingredients) {
      let [existingIngredient] = await db.select().from(tables.ingredients)
        .where(eq(tables.ingredients.name, ingredient.name.toLowerCase()))
        .limit(1)

      if (!existingIngredient) {
        [existingIngredient] = await db.insert(tables.ingredients)
          .values({ name: ingredient.name.toLowerCase() })
          .returning()
      }

      await db.insert(tables.recipeIngredients).values({
        recipeId: parseInt(id),
        ingredientId: existingIngredient.id,
        quantity: ingredient.quantity
      })
    }
  }

  return updatedRecipe[0]
})