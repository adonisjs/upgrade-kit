import { test } from '@japa/runner'
import { upgradeRcFile } from '../src/patchers/upgrade_rc_file/index.js'
import { createRunner } from '../test_helpers/index.js'

test.group('Upgrade rc file', () => {
  test('migrate commands', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        commands: ['@foo/bar/commands', '@bar/foo/build/commands'],
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradeRcFile()],
    }).run()

    const rcFile = await fs.contents('adonisrc.ts')
    assert.snapshot(rcFile).match()
  })

  test('should remove ./commands since it is not needed anymore', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        commands: ['./commands'],
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradeRcFile()],
    }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('should update old commands with new ones', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        commands: ['@adonisjs/core/build/commands', '@adonisjs/lucid/build/commands'],
      },
    })

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradeRcFile()],
    }).run()

    await assert.fileContains(
      'adonisrc.ts',
      "commands: [() => import('@adonisjs/core/commands'), () => import('@adonisjs/lucid/commands')]"
    )
  })

  test('Remove .adonisrc.json file', async ({ assert, fs }) => {
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
      patchers: [upgradeRcFile()],
    }).run()

    await assert.fileNotExists('.adonisrc.json')
  })

  test('migrate preloads files', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        preloads: ['./foo/bar', './bar/foo'],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    const file = await fs.contents('adonisrc.ts')
    assert.snapshot(file).match()
  })

  test('keep environments while migrating preload files', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        preloads: [
          { file: './foo/bar', environment: ['web'] },
          { file: './bar/foo', environment: ['console', 'repl'] },
          './hello',
        ],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    const file = await fs.contents('adonisrc.ts')
    assert.snapshot(file).match()
  })

  test('migrate providers', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        providers: ['@adonisjs/foo', '@adonisjs/bar'],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('replace adonisjs/core with new providers', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        providers: ['@adonisjs/core'],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('replace old providers with new one', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        providers: ['@adonisjs/session', '@adonisjs/view', '@adonisjs/redis'],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('migrate directories', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        directories: {
          config: 'config',
          public: 'public',
        },
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('migrate meta files', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        metaFiles: [
          {
            pattern: 'foo/bar',
            reloadServer: true,
          },
        ],
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })

  test('migrate tests suites', async ({ assert, fs }) => {
    await fs.setupProject({
      rcFile: {
        tests: {
          suites: [
            {
              files: ['tests/unit/**/*.spec(.ts|.js)'],
              name: 'unit',
              timeout: 60000,
            },
          ],
        },
      },
    })

    await createRunner({ projectPath: fs.basePath, patchers: [upgradeRcFile()] }).run()

    assert.snapshot(await fs.contents('adonisrc.ts')).match()
  })
})
