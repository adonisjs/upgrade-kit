exports[`Database config > Update database config 1`] = `"import Env from '@ioc:Adonis/Core/Env'
import { defineConfig } from \\"@adonisjs/database\\";

const databaseConfig = defineConfig({
  connection: Env.get('DB_CONNECTION'),
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  }
})

export default databaseConfig
"`

