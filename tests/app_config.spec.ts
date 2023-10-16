import { test } from '@japa/runner'
import dedent from 'dedent'
import { createRunner } from '../test_helpers/index.js'
import { appConfig } from '../src/patchers/app_config/index.js'

test.group('App config', () => {
  test('Update app http config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/app.ts',
      dedent`
        import proxyAddr from 'proxy-addr'
        import type { ServerConfig } from '@ioc:Adonis/Core/Server'

        export const http: ServerConfig = {
          allowMethodSpoofing: false,
          subdomainOffset: 2,
          generateRequestId: false,
          trustProxy: proxyAddr.compile('loopback'),
          etag: false,
          jsonpCallbackName: 'callback',
          cookie: {
            domain: '',
            path: '/',
            maxAge: '2h',
            httpOnly: true,
            secure: false,
            sameSite: false,
          },
        }
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [appConfig()],
    }).run()

    const content = await fs.contents('config/app.ts')

    assert.snapshot(content).matchInline(`
          "import proxyAddr from 'proxy-addr'
          import { defineConfig } from \\"@adonisjs/core/http\\";

          export const http = defineConfig({
            allowMethodSpoofing: false,
            subdomainOffset: 2,
            generateRequestId: false,
            trustProxy: proxyAddr.compile('loopback'),
            etag: false,
            jsonpCallbackName: 'callback',
            cookie: {
              domain: '',
              path: '/',
              maxAge: '2h',
              httpOnly: true,
              secure: false,
              sameSite: false,
            },
          })
          "
        `)
  })
})
