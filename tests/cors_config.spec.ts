import { test } from '@japa/runner'
import dedent from 'dedent'
import { createRunner } from '../test_helpers/index.js'
import { corsConfig } from '../src/patchers/config_files/cors_config.js'

test.group('Cors config', () => {
  test('Update cors config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/cors.ts',
      dedent`
      import type { CorsConfig } from '@ioc:Adonis/Core/Cors'

      const corsConfig: CorsConfig = {
        enabled: true,
        origin: '*',
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
        headers: true,
        exposeHeaders: ['pragma'],
        credentials: true,
        maxAge: 90,
      }

      export default corsConfig
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [corsConfig()],
    }).run()

    const content = await fs.contents('config/cors.ts')
    assert.snapshot(content).matchInline(`
      "import { defineConfig } from \\"@adonisjs/cors\\";

      const corsConfig = defineConfig({
        enabled: true,
        origin: '*',
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
        headers: true,
        exposeHeaders: ['pragma'],
        credentials: true,
        maxAge: 90,
      })

      export default corsConfig
      "
    `)
  })
})
