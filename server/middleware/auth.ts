import { defineEventHandler, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { tables, useDrizzle, eq } from '~/server/utils/database'

const {jwtSecret} = useRuntimeConfig()

export default defineEventHandler(async (event) => {

  const token = event.node.req.headers.authorization?.split(' ')[1]

  if (token) {
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: number }
        const db = useDrizzle()
        const user = await db.select().from(tables.users).where(eq(tables.users.id, decoded.userId)).limit(1)
    
        if (!user[0]) {
          return
        }
        event.context.auth = { userId: user[0].id }
      } catch (error) {
        console.error("Error in auth middleware:", error)
      }
  }

  
})