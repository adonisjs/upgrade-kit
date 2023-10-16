import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { updateModuleSystem } from '../src/patchers/update_module_system/index.js'

test.group('Update Module System', () => {
  test('add type module to pkg json', async ({ assert, fs }) => {
    await fs.setupProject({})

    await createRunner({
      projectPath: fs.basePath,
      patchers: [updateModuleSystem()],
    }).run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.equal(pkgJson.type, 'module')
  })

  test('update tsconfig with new extends', async ({ assert, fs }) => {
    await fs.setupProject({})

    await createRunner({
      projectPath: fs.basePath,
      patchers: [updateModuleSystem()],
    }).run()

    const tsConfig = await fs.contentsJson('tsconfig.json')

    assert.equal(tsConfig.extends, '@adonisjs/tsconfig/tsconfig.app.json')
  })

  test('remove adonisjs and japa types from tsconfig', async ({ assert, fs }) => {
    await fs.setupProject({
      tsconfig: {
        compilerOptions: {
          types: ['@adonisjs/foo', '@japa/foo', '@adonisjs/bla', '@japa/bla'],
        },
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [updateModuleSystem()],
    }).run()

    const tsConfig = await fs.contentsJson('tsconfig.json')
    assert.isEmpty(tsConfig.compilerOptions.types)
  })

  test('keep other types in tsconfig', async ({ assert, fs }) => {
    await fs.setupProject({
      tsconfig: {
        compilerOptions: {
          types: ['foo', 'bar', '@adonisjs/foo'],
        },
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [updateModuleSystem()],
    }).run()

    const tsConfig = await fs.contentsJson('tsconfig.json')
    assert.deepEqual(tsConfig.compilerOptions.types, ['foo', 'bar'])
  })
})
