import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'

export class MigrateImports extends BaseCommand {
  static commandName = 'migrate:imports'
  static description = 'Migrate AdonisJS imports to ESM'

  static help = `
    This command migrate your codebase to use new imports :
      - Convert all aliases to subpath imports
      - Add extensions to all imports ( Required by ESM )
      - Rewrite all IoC imports
  `

  async run() {
    this.displayHeading()

    const selectedPatchers = await this.prompt.multiple('What patchers should we run?', [
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
    ])

    await new Runner({
      patchers: this.generatePatchersFromPrompt(selectedPatchers),
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
