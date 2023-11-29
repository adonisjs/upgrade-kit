import { test } from '@japa/runner'
import dedent from 'dedent'

import { createRunner } from '../test_helpers/index.js'
import { databaseConfig } from '../src/patchers/config_files/database_config.js'

test.group('Database config', () => {
  test('Update database config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/database.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'
      import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

      const databaseConfig = {
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
      }

      export default databaseConfig
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [databaseConfig()],
    }).run()

    const content = await fs.contents('config/database.ts')

    assert.snapshot(content).match()
  })
})
