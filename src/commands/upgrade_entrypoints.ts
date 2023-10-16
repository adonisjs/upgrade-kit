import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { upgradeEntrypoints } from '../patchers/upgrade_entrypoints/index.js'

export class UpgradeEntrypoints extends BaseCommand {
  static commandName = `upgrade-entrypoints`
  static description =
    'Upgrade AdonisJS entrypoints to new API. ( bin/server.ts, bin/console.ts, bin/test.ts, and also your root ace.js file )'

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradeEntrypoints()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
