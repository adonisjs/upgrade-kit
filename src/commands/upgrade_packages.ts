import { upgradePackages } from '../patchers/upgrade_packages/index.js'
import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'

export class UpgradePackages extends BaseCommand {
  static commandName = 'upgrade-packages'
  static description = `Will update official AdonisJS packages, remove the deprecated one and install the new one.`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradePackages()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
