import { consola } from 'consola'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

export default defineNitroPlugin(async () => {
    if (!import.meta.dev) return

    try{
        await migrate(useDrizzle(), { migrationsFolder: 'server/database/migrations' })
        consola.success('Database migrations done')
        
    }
    catch(e){
        consola.error('Database migrations failed!', e)
    }
    
   
})
