import { test } from '@japa/runner'
import dedent from 'dedent'

import { createRunner } from '../test_helpers/index.js'
import { sessionConfig } from '../src/patchers/config_files/session_config.js'

test.group('Session config', () => {
  test('Update session config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/session.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'
      import Application from '@ioc:Adonis/Core/Application'
      import { SessionConfig } from '@ioc:Adonis/Addons/Session'

      const sessionConfig = {
        enabled: true,
        driver: Env.get('SESSION_DRIVER'),
        cookieName: 'adonis-session',
        clearWithBrowser: false,
        age: '2h',
        cookie: {
          path: '/',
          httpOnly: true,
          sameSite: false,
        },
        file: {
          location: Application.tmpPath('sessions'),
        },
        redisConnection: 'local',
      }

      export default sessionConfig
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [sessionConfig()],
    }).run()

    const content = await fs.contents('config/session.ts')

    assert.snapshot(content).match()
  })
})
