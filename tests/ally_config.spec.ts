import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { allyConfig } from '../src/patchers/config_files/ally_config.js'

test.group('Ally config', () => {
  test('Update ally config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/ally.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'
      import { AllyConfig } from '@ioc:Adonis/Addons/Ally'

      const allyConfig: AllyConfig = {
        github: {
          driver: 'github',
          clientId: Env.get('GITHUB_CLIENT_ID'),
          clientSecret: Env.get('GITHUB_CLIENT_SECRET'),
          callbackUrl: 'foo',
        },
        google: {
          driver: 'google',
          clientId: Env.get('GOOGLE_CLIENT_ID'),
          clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
          callbackUrl: 'foo',
        },
      }

      export default allyConfig
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [allyConfig()],
    }).run()

    const content = await fs.contents('config/ally.ts')

    assert.snapshot(content).matchInline(`
      "import Env from '@ioc:Adonis/Core/Env'
      import { defineConfig } from \\"@adonisjs/ally\\";
      import { services } from \\"@adonisjs/ally\\";

      const allyConfig: AllyConfig = defineConfig({
        github: drivers.github({
          clientId: Env.get('GITHUB_CLIENT_ID'),
          clientSecret: Env.get('GITHUB_CLIENT_SECRET'),
          callbackUrl: 'foo',
        }),
        google: drivers.google({
          clientId: Env.get('GOOGLE_CLIENT_ID'),
          clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
          callbackUrl: 'foo',
        }),
      })

      export default allyConfig

      declare module '@adonisjs/ally/types' {
        interface SocialProviders extends InferSocialProviders<typeof allyConfig> { }
      }
      "
    `)
  })
})
