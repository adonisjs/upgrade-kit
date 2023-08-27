import { test } from '@japa/runner'
import { createRunner } from '../test_helpers/index.js'
import { addBinFiles } from '../src/patchers/add_bin_files/index.js'

test.group('Add bin files', () => {
  test('Add new bin files', async ({ assert, fs }) => {
    await fs.setupProject({})

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addBinFiles()],
    }).run()

    await assert.fileExists('bin/console.ts')
    await assert.fileExists('bin/test.ts')
    await assert.fileExists('bin/server.ts')
  })
})
