import { test } from '@japa/runner'
import dedent from 'dedent'

import { createRunner } from '../test_helpers/index.js'
import { upgradeCommandOptions } from '../src/patchers/upgrade_command_options/index.js'

test.group('Upgrade Command Options', () => {
  test('Remove aliases from .rcfile', async ({ assert, fs }) => {
    await fs.setupProject({})
    await fs.create(
      'commands/foo.ts',
      dedent`
      export default class TestCommand extends BaseCommand {
        public static settings = {
          loadApp: false,
          stayAlive: false,
        }

        foo() {}
      }
    `
    )

    await fs.create(
      'commands/foo/bar.ts',
      dedent`
      export default class TestCommandBar extends BaseCommand {

        a() {}

        public static settings = {
          loadApp: true,
          stayAlive: false,
        }

        b() {}
      }
    `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [upgradeCommandOptions()],
    }).run()

    const fooCommand = await fs.contents('commands/foo.ts')
    const fooBarCommand = await fs.contents('commands/foo/bar.ts')

    assert.snapshot(fooCommand).matchInline(`
      "import { CommandOptions } from \\"@adonisjs/core/types/ace\\";

      export default class TestCommand extends BaseCommand {
          static options: CommandOptions = {
                loadApp: false,
                staysAlive: false,
              };

        foo() {}
      }"
    `)
    assert.snapshot(fooBarCommand).matchInline(`
      "import { CommandOptions } from \\"@adonisjs/core/types/ace\\";

      export default class TestCommandBar extends BaseCommand {

        a() {}

          static options: CommandOptions = {
                loadApp: true,
                staysAlive: false,
              };

        b() {}
      }"
    `)
  })
})
