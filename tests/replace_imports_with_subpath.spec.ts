import { test } from '@japa/runner'
import { migrateAliasesToSubpath } from '../src/patchers/migrate_aliases_to_subpath/index.js'
import dedent from 'dedent'
import { createRunner } from '../test_helpers/index.js'

test.group('Replace imports with subpath', () => {
  test('Remove aliases from .rcfile', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        aliases: {
          App: './app',
          Contracts: './contracts',
        },
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [migrateAliasesToSubpath()],
    }).run()

    await assert.fileEquals('.adonisrc.json', '{}')
  })

  test('append default subpath to tsconfig and pkg json', async ({ assert, fs }) => {
    await fs.setupProject({
      tsconfig: {
        compilerOptions: {
          paths: {
            foo: ['./foo/*'],
          },
        },
      },
      pkgJson: {
        imports: {
          foo: './foo/*',
        },
      },
      rcFile: {
        aliases: {
          foo: 'Foo/Models',
        },
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [migrateAliasesToSubpath()],
    }).run()

    const tsConfig = await fs.contentsJson('tsconfig.json')
    const pkgJson = await fs.contentsJson('package.json')

    assert.properties(tsConfig.compilerOptions.paths, ['#foo/*', '#controllers/*', '#models/*'])
    assert.properties(pkgJson.imports, ['#foo/*', '#controllers/*', '#models/*'])
  })

  test('convert alias import to subpath import', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        aliases: {
          App: 'app',
          Contracts: 'contracts',
        },
      },
    })

    await fs.create(
      'index.ts',
      dedent`
      import { Foo } from 'App/Models/Foo'
      import { Bar } from 'Contracts/Bar'
    `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [migrateAliasesToSubpath()],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { Foo } from '#app/Models/Foo'
        import { Bar } from '#contracts/Bar'
      `
    )

    const rcFile = await fs.contentsJson('.adonisrc.json')
    assert.deepEqual(rcFile, {})

    const tsConfig = await fs.contentsJson('tsconfig.json')
    assert.deepPropertyVal(tsConfig.compilerOptions.paths, '#app/*', ['./app/*'])
    assert.deepPropertyVal(tsConfig.compilerOptions.paths, '#contracts/*', ['./contracts/*'])

    const pkgJson = await fs.contentsJson('package.json')
    assert.deepPropertyVal(pkgJson.imports, '#app/*', './app/*.js')
    assert.deepPropertyVal(pkgJson.imports, '#contracts/*', './contracts/*.js')
  })
})
