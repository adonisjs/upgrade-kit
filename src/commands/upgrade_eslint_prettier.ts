import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { upgradeEslintPrettier } from '../patchers/upgrade_eslint_prettier/index.js'

export class UpgradeEslintPrettier extends BaseCommand {
  static commandName = 'upgrade-eslint-prettier'
  static description = `Update your existing ESLint config and Prettier config files to use the new base configuration shipped with v6 apps.`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradeEslintPrettier()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
