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

  if (existingLike[0]) {
    await db.delete(tables.likes)
      .where(and(
        eq(tables.likes.recipeId, parseInt(id)),
        eq(tables.likes.userId, userId)
      ))
  } else {
    await db.insert(tables.likes).values({
      recipeId: parseInt(id),
      userId: userId
    })
  }

  const likeCount = await db.select({ count: sql<number>`count(*)` })
    .from(tables.likes)
    .where(eq(tables.likes.recipeId, parseInt(id)))
    .then(result => result[0].count)

  return { likes: likeCount }
})