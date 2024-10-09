import { eventHandler, H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { tables, useDrizzle, eq } from '~/server/utils/database'

const { jwtSecret } = useRuntimeConfig()

export function defineAuthEventHandler(handler: (event: H3Event) => Promise<any>) {
  return eventHandler(async (event) => {
    const token = event.node.req.headers.authorization?.split(' ')[1]

    if (!token) {
      return { error: 'Unauthorized: No token provided', status: 401 }
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: number }
      const db = useDrizzle()
      const user = await db.select().from(tables.users).where(eq(tables.users.id, decoded.userId)).limit(1)

      if (!user[0]) {
        return { error: 'Unauthorized: Invalid token', status: 401 }
      }

      event.context.auth = { userId: user[0].id }
      return await handler(event)
    } catch (error) {
      console.error('Error in auth event handler:', error)
      return { error: 'Unauthorized: Invalid token', status: 401 }
    }
  })
}