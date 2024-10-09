import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema
const {databaseHost} = useRuntimeConfig()
const sqlite = new Database(databaseHost)
export function useDrizzle() {
    return drizzle(sqlite, {schema})
}

export type User = typeof schema.users.$inferSelect
export type Recipes = typeof schema.recipes.$inferSelect
export type Ingredients = typeof schema.ingredients.$inferSelect
