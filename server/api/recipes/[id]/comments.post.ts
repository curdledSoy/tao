export default defineAuthEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const userId = event.context.auth.userId
  const { content } = await readBody(event)
  const db = useDrizzle()

  const newComment = await db.insert(tables.comments)
    .values({
      recipeId: parseInt(id),
      userId: userId,
      comment: content
    })
    .returning()

  const commentWithAuthor = await db.select({
    id: tables.comments.id,
    content: tables.comments.comment,
    author: tables.users.username,
    createdAt: tables.comments.createdAt,
  })
  .from(tables.comments)
  .innerJoin(tables.users, eq(tables.comments.userId, tables.users.id))
  .where(eq(tables.comments.id, newComment[0].id))
  .limit(1)

  return commentWithAuthor[0]
})