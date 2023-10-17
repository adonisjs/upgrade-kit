import { test } from '@japa/runner'
import { createRunner } from '../test_helpers/index.js'
import { upgradeEslintPrettier } from '../src/patchers/upgrade_eslint_prettier/index.js'

test.group('Upgrade Eslint Prettier', (group) => {
  group.tap((t) => t.timeout(0))

  test('remove old configuration files', async ({ assert, fs }) => {
    await fs.create('.eslintrc.json', '')
    await fs.create('.eslintignore', '')
    await fs.create('.prettierrc', '')

    await fs.setupProject({
      pkgJson: {
        devDependencies: {
          'eslint-config-prettier': '*',
          'eslint-plugin-adonis': '*',
          'eslint-plugin-prettier': '*',
        },
      },
    })

    await createRunner({
      patchers: [upgradeEslintPrettier('pnpm')],
      projectPath: fs.basePath,
    }).run()

    assert.isFalse(await fs.exists('.eslintrc.json'))
    assert.isFalse(await fs.exists('.eslintignore'))
    assert.isFalse(await fs.exists('.prettierrc'))
  })

  test('remove old packages', async ({ assert, fs }) => {
    await fs.setupProject({
      pkgJson: {
        devDependencies: {
          'eslint-config-prettier': '*',
          'eslint-plugin-adonis': '*',
          'eslint-plugin-prettier': '*',
        },
      },
    })

    await createRunner({
      patchers: [upgradeEslintPrettier('pnpm')],
      projectPath: fs.basePath,
    }).run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.isUndefined(pkgJson.devDependencies?.['eslint-config-prettier'])
    assert.isUndefined(pkgJson.devDependencies?.['eslint-plugin-adonis'])
    assert.isUndefined(pkgJson.devDependencies?.['eslint-plugin-prettier'])
  })

  test('add new packages', async ({ assert, fs }) => {
    await fs.setupProject({
      pkgJson: {
        devDependencies: {
          'eslint-config-prettier': '*',
          'eslint-plugin-adonis': '*',
          'eslint-plugin-prettier': '*',
        },
      },
    })

    await createRunner({
      patchers: [upgradeEslintPrettier('pnpm')],
      projectPath: fs.basePath,
    }).run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.isDefined(pkgJson.devDependencies?.['@adonisjs/eslint-config'])
    assert.isDefined(pkgJson.devDependencies?.['@adonisjs/prettier-config'])
    assert.isDefined(pkgJson.devDependencies?.['eslint'])
    assert.isDefined(pkgJson.devDependencies?.['prettier'])
  })

  test('configure new eslint and prettier', async ({ assert, fs }) => {
    await fs.setupProject({
      pkgJson: {
        devDependencies: {
          'eslint-config-prettier': '*',
          'eslint-plugin-adonis': '*',
          'eslint-plugin-prettier': '*',
        },
      },
    })

    await createRunner({
      patchers: [upgradeEslintPrettier('pnpm')],
      projectPath: fs.basePath,
    }).run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.deepEqual(pkgJson.eslintConfig.extends, ['@adonisjs/eslint-config/app'])
    assert.isAbove(Object.keys(pkgJson.eslintConfig.rules).length, 1)
    assert.deepEqual(pkgJson.prettier, '@adonisjs/prettier-config')
  })
})
