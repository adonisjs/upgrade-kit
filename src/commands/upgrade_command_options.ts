import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { upgradeCommandOptions } from '../patchers/upgrade_command_options/index.js'

export class UpgradeCommandOptions extends BaseCommand {
  static commandName = 'upgrade-command-options'
  static description = `Update command options to the latest API`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradeCommandOptions()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
