import { test } from '@japa/runner'
import { ConfigUpdaterPatcher } from '../src/patchers/config_updater_patcher.js'
import dedent from 'dedent'
import { createRunner } from '../test_helpers/index.js'

test.group('Config Update Patcher | getConfigExpression', () => {
  test('simple literal expression', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create('config/app.ts', dedent`export default { foo: 42 }`)

    const runner = createRunner({ projectPath: fs.basePath, patchers: [] })
    const configUpdater = new ConfigUpdaterPatcher(runner)

    const result = configUpdater.getConfigExpression(configUpdater.getConfigFile('config/app.ts')!)

    assert.snapshot(result.getText()).matchInline('"{ foo: 42 }"')
  })

  test('identifier', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create('config/app.ts', dedent`const config = { foo: 42 }; export default config`)

    const runner = createRunner({ projectPath: fs.basePath, patchers: [] })
    const configUpdater = new ConfigUpdaterPatcher(runner)

    const result = configUpdater.getConfigExpression(configUpdater.getConfigFile('config/app.ts')!)

    assert.snapshot(result.getText()).matchInline('"{ foo: 42 }"')
  })

  test('function call', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/app.ts',
      dedent`
      export default defineConfig({ foo: 42 })
    `
    )

    const runner = createRunner({ projectPath: fs.basePath, patchers: [] })
    const configUpdater = new ConfigUpdaterPatcher(runner)

    const result = configUpdater.getConfigExpression(configUpdater.getConfigFile('config/app.ts')!)

    assert.snapshot(result.getText()).matchInline('"{ foo: 42 }"')
  })

  test('function call with identifier', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/app.ts',
      dedent`
      const config = defineConfig({ foo: 42 })
      export default config
    `
    )

    const runner = createRunner({ projectPath: fs.basePath, patchers: [] })
    const configUpdater = new ConfigUpdaterPatcher(runner)

    const result = configUpdater.getConfigExpression(configUpdater.getConfigFile('config/app.ts')!)

    assert.snapshot(result.getText()).matchInline('"{ foo: 42 }"')
  })
})
