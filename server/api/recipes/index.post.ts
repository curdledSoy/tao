import { tables, useDrizzle } from '~/server/utils/database'

export default defineAuthEventHandler(async (event) => {
  const db = useDrizzle()
  const userId = event.context.auth.userId
  const body = await readBody(event)

  // Validate the input (you may want to add more validation)
  if (!body.title || !body.instructions) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Title and instructions are required'
    })
  }

  try {
    // Insert the new recipe
    const [newRecipe] = await db.insert(tables.recipes).values({
      title: body.title,
      description: body.description,
      instructions: body.instructions,
      servings: body.servings,
      cookTime: body.cookTime,
      imageUrl: body.imageUrl,
      userId: userId,
      createdAt: new Date(),
    }).returning()

    // Insert ingredients
    if (body.ingredients && body.ingredients.length > 0) {
      for (const ingredient of body.ingredients) {
        // Check if the ingredient already exists
        let [existingIngredient] = await db.select().from(tables.ingredients).where(eq(tables.ingredients.name, ingredient.name.toLowerCase())).limit(1)

        if (!existingIngredient) {
          // If the ingredient doesn't exist, create it
          [existingIngredient] = await db.insert(tables.ingredients).values({
            name: ingredient.name.toLowerCase()
          }).returning()
        }

        // Insert the recipe-ingredient relationship
        await db.insert(tables.recipeIngredients).values({
          recipeId: newRecipe.id,
          ingredientId: existingIngredient.id,
          quantity: ingredient.quantity
        })
      }
    }

    return newRecipe
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while creating the recipe'
    })
  }
})