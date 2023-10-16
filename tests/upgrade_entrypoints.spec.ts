import { test } from '@japa/runner'
import { createRunner } from '../test_helpers/index.js'
import { upgradeEntrypoints } from '../src/patchers/upgrade_entrypoints/index.js'

test.group('Upgrade entrypoints', () => {
  test('Add new bin files and ace.js', async ({ assert, fs }) => {
    await fs.setupProject({})

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradeEntrypoints()],
    }).run()

    await assert.fileExists('bin/console.ts')
    await assert.fileExists('bin/test.ts')
    await assert.fileExists('bin/server.ts')
    await assert.fileExists('ace.js')
  })
})
