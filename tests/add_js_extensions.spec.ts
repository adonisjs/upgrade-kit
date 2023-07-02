import { test } from '@japa/runner'
import dedent from 'dedent'
import { addJsExtensions } from '../src/patchers/add_js_extensions/index.js'
import { createRunner } from '../test_helpers/index.js'

test.group('Add js extensions', () => {
  test('Rewrite directory import', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create(
      'directory/index.ts',
      dedent`
        export const foo = 'bar'
      `
    )

    await fs.create(
      'index.ts',
      dedent`
       import { foo } from './directory'
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addJsExtensions()],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { foo } from './directory/index.js'
      `
    )
  })

  test('add js extensions to imports', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create(
      'index.ts',
      dedent`
        import { foo } from './foo'
        import { bar } from './bar'
        import { baz } from './foo/bar/baz'

        console.log(foo, bar, baz)
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addJsExtensions()],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { foo } from './foo.js'
        import { bar } from './bar.js'
        import { baz } from './foo/bar/baz.js'

        console.log(foo, bar, baz)
      `
    )
  })

  test('does not add js extensions to imports that already have them', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create('index.ts', dedent`import { foo } from './foo.js'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addJsExtensions()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from './foo.js'`)
  })

  test('does not add js extensions to node modules', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create('index.ts', dedent`import { foo } from 'foo'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addJsExtensions()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from 'foo'`)
  })

  test('does not add js extensions to subpath imports', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create('index.ts', dedent`import { foo } from '#foo/bar'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [addJsExtensions()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from '#foo/bar'`)
  })
})
