import { test } from '@japa/runner'
import dedent from 'dedent'

import { createRunner } from '../test_helpers/index.js'
import { migrateRcFile } from '../src/patchers/migrate_rc_file/index.js'
import { addJsExtensions } from '../src/patchers/add_js_extensions/index.js'
import { rewriteIocImports } from '../src/patchers/rewrite_ioc_imports/index.js'
import { upgradeAliases } from '../src/patchers/upgrade_aliases/index.js'

test.group('Integrations', () => {
  test('All plugins', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        aliases: { App: 'app', Contracts: 'contracts' },
        providers: ['@adonisjs/core'],
      },
    })

    await fs.create(
      'index.ts',
      dedent/* ts */ `
      import myService from './my-service'

      import Env from '@ioc:Adonis/Core/Env'
      import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
      import Router from '@ioc:Adonis/Core/Route'

      import User from 'App/Models/User'

      export default class HomeController {
        public async index({ request }: HttpContextContract) {
          const name = Env.get('APP_NAME')
          return { name }
        }
      }
    `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [
        upgradeAliases(),
        rewriteIocImports(),
        addJsExtensions(),
        migrateRcFile(),
      ],
    }).run()

    await assert.fileEquals(
      `index.ts`,
      dedent/* ts */ `
      import myService from './my-service.js'

      import env from '#start/env'
      import { HttpContext } from '@adonisjs/core/http'
      import router from '@adonisjs/core/services/route'

      import User from '#app/Models/User'

      export default class HomeController {
        public async index({ request }: HttpContext) {
          const name = env.get('APP_NAME')
          return { name }
        }
      }
    `
    )

    /**
     * Check if package.json contains subpath imports
     */
    const pkgJson = await fs.contentsJson('package.json')
    assert.property(pkgJson.imports, '#app/*')
    assert.property(pkgJson.imports, '#contracts/*')

    /**
     * Verify adonisrc.ts file
     */
    const adonisrc = await fs.contents('adonisrc.ts')
    assert.snapshot(adonisrc).match()
  }).disableTimeout()
})
