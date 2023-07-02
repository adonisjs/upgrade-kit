import { test } from '@japa/runner'
import dedent from 'dedent'
import { rewriteIocImports } from '../src/patchers/rewrite_ioc_imports/index.js'
import { createRunner } from '../test_helpers/index.js'

test.group('Rewrite Ioc Imports', () => {
  test('Basic', async ({ assert, fs }) => {
    await fs.addTsConfig()

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
      patchers: [rewriteIocImports()],
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
    await fs.addTsConfig()

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
        rewriteIocImports({
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
    await fs.addTsConfig()

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
        rewriteIocImports({
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
})
