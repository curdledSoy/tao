import { tables, useDrizzle } from '~/server/utils/database'
import { desc, sql } from 'drizzle-orm'

export default defineAuthEventHandler(async (event) => {
  const db = useDrizzle()

  // Get query parameters
  const { page = 1, limit = 4 } = getQuery(event)
  const offset = (Number(page) - 1) * Number(limit)

  try {
    const trendingRecipes = await db.select({
      id: tables.recipes.id,
      title: tables.recipes.title,
      imageUrl: tables.recipes.imageUrl,
      author: tables.users.username,
      trendingScore: sql<number>`
        (SELECT COUNT(*) FROM ${tables.likes} WHERE ${tables.likes.recipeId} = ${tables.recipes.id})
      `.as('trending_score')
    })
    .from(tables.recipes)
    .innerJoin(tables.users, eq(tables.recipes.userId, tables.users.id))
    .orderBy(desc(sql`trending_score`))
    .limit(Number(limit))
    .offset(offset)

    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(tables.recipes)
      .then(result => result[0].count)

    return {
      recipes: trendingRecipes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
        totalRecipes: totalCount
      }
    }
  } catch (error) {
    console.error('Error fetching trending recipes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while fetching trending recipes'
    })
  }
})