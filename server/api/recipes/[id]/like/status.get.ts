export default defineAuthEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const userId = event.context.auth.userId
  const db = useDrizzle()

  const existingLike = await db.select()
    .from(tables.likes)
    .where(and(
      eq(tables.likes.recipeId, parseInt(id)),
      eq(tables.likes.userId, userId)
    ))
    .limit(1)
    const likeCount = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(tables.likes).where(eq(tables.likes.recipeId, parseInt(id)))
  return { isLiked: !!existingLike[0],  count: likeCount[0].count}
})