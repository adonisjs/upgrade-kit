import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'

export class MigrateAll extends BaseCommand {
  static commandName = 'migrate:all'
  static description = 'Apply all patches to migrate AdonisJS codebase'

  async run() {
    this.displayHeading()

    const selectedPatchers = await this.prompt.multiple('What patchers should we run?', [
      {
        name: 'env-config',
        message: 'Update env.ts file to use the new API',
      },
      {
        name: 'add-js-extensions',
        message: 'Add extensions to all imports ( Required by ESM )',
      },
      {
        name: 'migrate-aliases-to-subpath',
        message: 'Convert all aliases to subpath imports',
      },
      {
        name: 'rewrite-ioc-imports',
        message: 'Rewrite all IoC imports',
      },
      {
        name: 'add-type-module',
        message: 'Add type module to package.json',
      },
      {
        name: 'app-config',
        message: 'Update app.ts file to use the new API',
      },
      {
        name: 'update-ace',
        message: 'Update ace file',
      },
      {
        name: 'migrate-rc-file',
        message: 'Move from .adonisrc.json to adonisrc.ts file',
      },
    ] as const)

    await new Runner({
      patchers: this.generatePatchersFromPrompt(selectedPatchers),
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
