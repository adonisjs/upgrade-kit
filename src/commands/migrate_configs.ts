import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'

export class MigrateConfigs extends BaseCommand {
  static commandName = 'migrate:configs'
  static description = 'Migrate AdonisJS configs'

  static help = `
    This command will help migrating some config files to the new APIs.
    Will also update rcfile and package.json
  `

  async run() {
    this.displayHeading()

    const selectedPatchers = await this.prompt.multiple('What patchers should we run?', [
      {
        name: 'env-config',
        message: 'Update env.ts file to use the new API',
      },
      {
        name: 'app-config',
        message: 'Update config/app.ts file to use the new API',
      },
      {
        name: 'bodyparser-config',
        message: 'Update config/bodyparser.ts file to use the new API',
      },
      {
        name: 'session-config',
        message: 'Update config/session.ts file to use the new API',
      },
      {
        name: 'static-config',
        message: 'Update config/static.ts file to use the new API',
      },
      {
        name: 'cors-config',
        message: 'Update config/cors.ts file to use the new API',
      },
      {
        name: 'update-ace',
        message: 'Update ace file',
      },
      {
        name: 'migrate-rc-file',
        message: 'Move from .adonisrc.json to adonisrc.ts file',
      },
      {
        name: 'add-bin-files',
        message: 'Add bin files needed to run the server/test/console',
      },
    ] as const)

    await new Runner({
      patchers: this.generatePatchersFromPrompt(selectedPatchers),
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
