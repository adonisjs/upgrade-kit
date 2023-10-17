import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { shieldConfig } from '../src/patchers/config_files/shield_config.js'

test.group('Shield config', () => {
  test('Update shield config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/shield.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'
      import { ShieldConfig } from '@ioc:Adonis/Addons/Shield'

      export const csp: ShieldConfig['csp'] = {
        enabled: false,
        directives: {},
        reportOnly: false,
      }

      export const csrf: ShieldConfig['csrf'] = {
        enabled: Env.get('NODE_ENV') !== 'test',
        exceptRoutes: [],
        enableXsrfCookie: true,
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
      }

      export const dnsPrefetch: ShieldConfig['dnsPrefetch'] = {
        enabled: true,
        allow: true,
      }

      export const xFrame: ShieldConfig['xFrame'] = {
        enabled: true,
        action: 'DENY',
      }

      export const hsts: ShieldConfig['hsts'] = {
        enabled: true,
        maxAge: '180 days',
        includeSubDomains: true,
        preload: false,
      }

      export const contentTypeSniffing: ShieldConfig['contentTypeSniffing'] = {
        enabled: true,
      }
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [shieldConfig()],
    }).run()

    const content = await fs.contents('config/shield.ts')
    assert.snapshot(content).matchInline(`
      "
      import env from '#start/env'
      import { defineConfig } from '@adonisjs/shield'

      export default defineConfig({
        csp: {
          enabled: false,
          directives: {},
          reportOnly: false,
        },
        csrf: {
          enabled: Env.get('NODE_ENV') !== 'test',
          exceptRoutes: [],
          enableXsrfCookie: true,
          methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        },
        hsts: {
          enabled: true,
          maxAge: '180 days',
          includeSubDomains: true,
          preload: false,
        },
        contentTypeSniffing: {
          enabled: true,
        },
      })
      "
    `)
  })
})
