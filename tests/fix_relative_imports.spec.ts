import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { fixRelativeImports } from '../src/patchers/fix_relative_imports/index.js'

test.group('Fix relative imports', () => {
  test('Rewrite directory import', async ({ assert, fs }) => {
    await fs.setupProject({})

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
      patchers: [fixRelativeImports()],
    }).run()

    await assert.fileEquals(
      'index.ts',
      dedent`
        import { foo } from './directory/index.js'
      `
    )
  })

  test('add js extensions to imports', async ({ assert, fs }) => {
    await fs.setupProject({})

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
      patchers: [fixRelativeImports()],
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
    await fs.setupProject({})

    await fs.create('index.ts', dedent`import { foo } from './foo.js'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [fixRelativeImports()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from './foo.js'`)
  })

  test('does not add js extensions to node modules', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create('index.ts', dedent`import { foo } from 'foo'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [fixRelativeImports()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from 'foo'`)
  })

  test('does not add js extensions to subpath imports', async ({ assert, fs }) => {
    await fs.setupProject({
      tsconfig: {
        compilerOptions: {
          paths: {
            '#foo/*': ['./foo/*.js'],
          },
        },
      },
    })

    await fs.create('foo/bar.ts', dedent`export const foo = 'bar'`)
    await fs.create('index.ts', dedent`import { foo } from '#foo/bar'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [fixRelativeImports()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from '#foo/bar'`)
  })

  test('add index to subpath imports that are directories', async ({ assert, fs }) => {
    await fs.setupProject({
      pkgJson: {
        imports: {
          '#helpers/*': './helpers/*.js',
        },
      },
    })

    await fs.create('helpers/index.ts', dedent`export const foo = 'bar'`)
    await fs.create('index.ts', dedent`import { foo } from '#helpers'`)

    await createRunner({
      projectPath: fs.basePath,
      patchers: [fixRelativeImports()],
    }).run()

    await assert.fileEquals('index.ts', dedent`import { foo } from '#helpers/index'`)
  })

  test('handle ./index imports', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create('index.ts', 'export const foo = "bar"')
    await fs.create('foo.ts', `import { foo } from './index'`)

    await createRunner({ projectPath: fs.basePath, patchers: [fixRelativeImports()] }).run()

    await assert.fileEquals('foo.ts', `import { foo } from './index.js'`)
  })
})
