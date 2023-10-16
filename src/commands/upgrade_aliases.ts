import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { upgradeAliases } from '../patchers/upgrade_aliases/index.js'

export class UpgradeAliases extends BaseCommand {
  static commandName = 'upgrade-aliases'
  static description = `Migrates your application from AdonisJS aliases to Node.js sub-path imports`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradeAliases()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
