import { defineEventHandler, readBody, createError } from 'h3'
import { tables, useDrizzle, eq } from '~/server/utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const {jwtSecret} = useRuntimeConfig()
const JWT_EXPIRES_IN = '1h'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const { email, password } = await readBody(event)

  const user = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)

  if (!user[0] || !await bcrypt.compare(password, user[0].password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  const token = jwt.sign({ userId: user[0].id }, jwtSecret, { expiresIn: JWT_EXPIRES_IN })

  return { 
    token, 
    user: { id: user[0].id, email: user[0].email, username: user[0].username } 
  }
})