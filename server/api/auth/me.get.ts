
import { tables, useDrizzle, eq } from '~/server/utils/database'

export default defineAuthEventHandler(async (event) => {
  const db = useDrizzle()
  const userId = event.context.auth.userId

  const user = await db.select({
    id: tables.users.id,
    email: tables.users.email,
    username: tables.users.username
  }).from(tables.users).where(eq(tables.users.id, userId)).limit(1)

  return { user: user[0] }
})