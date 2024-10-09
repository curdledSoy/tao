import { defineEventHandler, readBody, createError } from 'h3'
import { tables, useDrizzle, eq } from '~/server/utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const {jwtSecret} = useRuntimeConfig()
const JWT_EXPIRES_IN = '1h'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const { email, password, username } = await readBody(event)

  const existingUser = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)

  if (existingUser[0]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User with this email already exists'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await db.insert(tables.users).values({
    email,
    password: hashedPassword,
    username
  }).returning()

  const token = jwt.sign({ userId: newUser[0].id }, jwtSecret, { expiresIn: JWT_EXPIRES_IN })

  return { 
    token, 
    user: { id: newUser[0].id, email: newUser[0].email, username: newUser[0].username } 
  }
})