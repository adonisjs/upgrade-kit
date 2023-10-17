import { test } from '@japa/runner'
import dedent from 'dedent'
import { createRunner } from '../test_helpers/index.js'
import { envConfig } from '../src/patchers/env_config/index.js'

test.group('Env config', () => {
  test('Update env config', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create(
      'env.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'

      export default Env.rules({
        HOST: Env.schema.string({ format: 'host' }),
        PORT: Env.schema.number(),
        APP_KEY: Env.schema.string(),
        APP_NAME: Env.schema.string(),
      })`
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [envConfig()],
    }).run()

    await assert.fileContains(
      'start/env.ts',
      dedent`
      import { Env } from "@adonisjs/core/env";

      export default await Env.create(new URL("../", import.meta.url), {
        HOST: Env.schema.string({ format: 'host' }),
        PORT: Env.schema.number(),
        APP_KEY: Env.schema.string(),
        APP_NAME: Env.schema.string(),
      })
      `
    )
  })
})
