import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { upgradePackages } from '../src/patchers/upgrade_packages/index.js'

test.group('Upgrade Packages', (group) => {
  group.tap((t) => t.timeout(0).skip(!process.env.CI, 'Only run on CI'))

  test('Upgrade installed packages', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addRcFile()
    await fs.addPackageJsonFile({
      dependencies: {
        '@adonisjs/core': '^5.0.0',
      },
      devDependencies: {
        '@adonisjs/assembler': '^5.0.0',
        'pino-pretty': '^4.0.0',
      },
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm' })],
    })
    await runner.run()

    const pkgJson = await fs.contentsJson('package.json')

    assert.isTrue(pkgJson.dependencies['@adonisjs/core'].startsWith('^6'))
    assert.isTrue(pkgJson.devDependencies['@adonisjs/assembler'].startsWith('^7'))
    assert.isTrue(pkgJson.devDependencies['pino-pretty'].startsWith('^10'))
  })

  test('remove deprecated packages', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addRcFile()
    await fs.addPackageJsonFile({
      dependencies: {
        '@adonisjs/repl': '^5.0.0',
        'source-map-support': '^0.5.0',
      },
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm' })],
    })
    await runner.run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.isUndefined(pkgJson.dependencies?.['@adonisjs/repl'])
    assert.isUndefined(pkgJson.dependencies?.['source-map-support'])
  })

  test('add ts-node swc and adonisjs/validator', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addRcFile()
    await fs.addPackageJsonFile({
      dependencies: {
        '@adonisjs/core': '^5.0.0',
      },
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm' })],
    })
    await runner.run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.properties(pkgJson.dependencies, ['@adonisjs/validator'])
    assert.properties(pkgJson.devDependencies, ['ts-node', '@swc/core'])
  })

  test('add adonisjs/cors and adonisjs/static when has config files', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addRcFile()
    await fs.addPackageJsonFile({
      dependencies: {
        '@adonisjs/core': '^5.0.0',
      },
    })

    await fs.create('config/static.ts', 'export default {}')
    await fs.create('config/cors.ts', 'export default {}')

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm' })],
    })
    await runner.run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.properties(pkgJson.dependencies, ['@adonisjs/cors', '@adonisjs/static'])
  })

  test('should replace old packages by new ones', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addRcFile()
    await fs.addPackageJsonFile({
      dependencies: {
        'phc-argon2': '^1.1.4',
        'phc-bcrypt': '^1.0.8',
      },
      devDependencies: {
        '@japa/preset-adonis': '^1.2.0',
        'adonis-preset-ts': '^2.1.0',
      },
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm' })],
    })
    await runner.run()

    const pkgJson = await fs.contentsJson('package.json')
    assert.isUndefined(pkgJson.dependencies?.['phc-argon2'])
    assert.isUndefined(pkgJson.dependencies?.['phc-bcrypt'])
    assert.isUndefined(pkgJson.devDependencies?.['@japa/preset-adonisjs'])
    assert.isUndefined(pkgJson.devDependencies?.['adonis-preset-ts'])

    assert.isDefined(pkgJson.dependencies?.['argon2'])
    assert.isDefined(pkgJson.dependencies?.['bcrypt'])
    assert.isDefined(pkgJson.devDependencies?.['@japa/plugin-adonisjs'])
    assert.isDefined(pkgJson.devDependencies?.['@adonisjs/tsconfig'])
  })

  test('should rewrite the providers paths in rc file', async ({ assert, fs }) => {
    await fs.addTsConfig()
    await fs.addPackageJsonFile()
    await fs.addRcFile({
      providers: ['@adonisjs/core', '@adonisjs/session', '@adonisjs/view', '@adonisjs/shield'],
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm', skipInstall: true })],
    })

    await runner.run()

    const rcFile = await fs.contentsJson('.adonisrc.json')
    assert.deepEqual(rcFile.providers, [
      '@adonisjs/core/providers/app_provider',
      '@adonisjs/core/providers/hash_provider',
      {
        file: '@adonisjs/core/providers/repl_provider',
        environment: ['repl', 'test'],
      },
      '@adonisjs/session/session_provider',
      '@adonisjs/core/providers/edge_provider',
      '@adonisjs/shield/shield_provider',
    ])
  })

  test('should remove repl and index commands in rcfile', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        commands: ['./commands', '@adonisjs/repl/build/commands'],
      },
    })

    const runner = createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm', skipInstall: true })],
    })

    await runner.run()

    const rcFile = await fs.contentsJson('.adonisrc.json')

    assert.deepEqual(rcFile.commands, [])
  })

  test('should rewrite commands in rc file', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: { commands: ['@adonisjs/core/build/commands', '@adonisjs/lucid/build/commands'] },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradePackages({ packageManager: 'pnpm', skipInstall: true })],
    }).run()

    const rcFile = await fs.contentsJson('.adonisrc.json')
    assert.deepEqual(rcFile.commands, ['@adonisjs/core/commands', '@adonisjs/lucid/commands'])
  })
})
