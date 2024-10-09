import { tables, useDrizzle, eq, and } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  // Get all recipes with pagination and optional filtering
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const userId = query.userId as string
  const isDraft = query.isDraft as string

  let recipeQuery = db.select({
    id: tables.recipes.id,
    title: tables.recipes.title,
    description: tables.recipes.description,
    imageUrl: tables.recipes.imageUrl,
    userId: tables.recipes.userId,
    author: tables.users.username,
    createdAt: tables.recipes.createdAt,
    likes: sql<number>`(SELECT COUNT(*) FROM ${tables.likes} WHERE ${tables.likes.recipeId} = ${tables.recipes.id})`.as('likes_count'),
  }).from(tables.recipes).$dynamic().innerJoin(tables.users, eq(tables.recipes.userId, tables.users.id))


  if (userId) {
    const user = await db.select().from(tables.users).where(eq(tables.users.id, Number(userId)))
    if (user) {
      recipeQuery = recipeQuery.where(eq(tables.recipes.userId, Number(userId)))
    }
  }

  if (isDraft !== undefined) {
    recipeQuery = recipeQuery.where(eq(tables.recipes.isDraft, isDraft === 'true'))
  }

  const recipes = await recipeQuery
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(tables.recipes.createdAt)

  const totalCount = await db.select({ count: sql`count(*)`.mapWith(Number) })
    .from(tables.recipes)

  return {
    recipes,
    pagination: {
      page,
      limit,
      totalCount: totalCount[0].count,
      totalPages: Math.ceil(totalCount[0].count / limit)
    }
  }
})