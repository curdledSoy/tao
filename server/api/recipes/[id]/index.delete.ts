export default defineEventHandler(async (event) => {
  const {id} = getRouterParams(event)
  const db = useDrizzle()
  await db.delete(tables.recipes).where(eq(tables.recipes.id, parseInt(id)))
  return { message: 'Recipe deleted successfully' }
})
