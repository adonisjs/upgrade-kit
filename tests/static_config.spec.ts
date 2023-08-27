import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { staticConfig } from '../src/patchers/static_config/index.js'

test.group('Static config', () => {
  test('Update static config', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create(
      'config/static.ts',
      dedent`
      import { AssetsConfig } from '@ioc:Adonis/Core/Static'

      const staticConfig: AssetsConfig = {
        enabled: true,
        dotFiles: 'ignore',
        etag: true,
        lastModified: true,
      }

      export default staticConfig
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [staticConfig()],
    }).run()

    const content = await fs.contents('config/static.ts')

    assert.snapshot(content).match()
  })
})
