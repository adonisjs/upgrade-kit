import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { migrateIocImports } from '../src/patchers/migrate_ioc_imports/index.js'

test.group('Migrate Ioc Imports', (group) => {
  group.tap((t) => t.timeout(0))

  test('Basic', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'index.ts',
      dedent`
        import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

        console.log(HttpContextContract)

        type HttpContextExtended = HttpContextContract & {
          foo: string
        }
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [migrateIocImports()],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { HttpContext } from '@adonisjs/core/http'

        console.log(HttpContext)

        type HttpContextExtended = HttpContext & {
          foo: string
        }
      `
    )
  })

  test('multiple named imports', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'index.ts',
      dedent`
        import { HttpContextContract, RouteContract } from '@ioc:Adonis/Core/HttpContext'

        console.log(HttpContextContract, RouteContract)
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [
        migrateIocImports({
          importMap: {
            '@ioc:Adonis/Core/HttpContext': {
              '*': {
                newPath: '@adonisjs/core/http',
              },
              'HttpContextContract': {
                newName: 'HttpContext',
              },
              'RouteContract': {
                newName: 'RouteContract',
              },
            },
          },
        }),
      ],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { HttpContext, RouteContract } from '@adonisjs/core/http'

        console.log(HttpContext, RouteContract)
      `
    )
  })

  test('multiple named imports and one move out', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'index.ts',
      dedent`
        import { HttpContextContract, RouteContract } from '@ioc:Adonis/Core/HttpContext'

        console.log(HttpContextContract, RouteContract)
        `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [
        migrateIocImports({
          importMap: {
            '@ioc:Adonis/Core/HttpContext': {
              '*': {
                newPath: '@adonisjs/core/http',
              },
              'HttpContextContract': {
                newName: 'HttpContext',
              },
              'RouteContract': {
                newPath: '@adonisjs/core/router/types',
                newName: 'RouteType',
              },
            },
          },
        }),
      ],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { HttpContext } from '@adonisjs/core/http'
        import { RouteType } from "@adonisjs/core/router/types";

        console.log(HttpContext, RouteType)
      `
    )
  })

  test('rewrite default import', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'index.ts',
      dedent`
        import Event, { AnyHandler } from '@ioc:Adonis/Core/Event'
        import Logger, { Formatters } from '@ioc:Adonis/Core/Logger'

        console.log(Event, AnyHandler, Logger, Formatters)
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [
        migrateIocImports({
          importMap: {
            '@ioc:Adonis/Core/Event': {
              'default': {
                newPath: '@adonisjs/core/services/emitter',
                newName: 'emitter',
              },
              '*': {
                newPath: '@adonisjs/core/events',
              },
            },
            '@ioc:Adonis/Core/Logger': {
              default: {
                newPath: '@adonisjs/core/services/logger',
                newName: 'logger',
              },
              Formatters: {
                newName: 'FormattersNewName',
                newPath: '@adonisjs/core/logger',
              },
            },
          },
        }),
      ],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import emitter from '@adonisjs/core/services/emitter'
        import logger from '@adonisjs/core/services/logger'
        import { AnyHandler } from "@adonisjs/core/events";
        import { FormattersNewName } from "@adonisjs/core/logger";

        console.log(emitter, AnyHandler, logger, FormattersNewName)
      `
    )
  })
})
