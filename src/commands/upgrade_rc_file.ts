import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { upgradeRcFile } from '../patchers/upgrade_rc_file/index.js'

export class UpgradeRcFile extends BaseCommand {
  static commandName = 'upgrade-rcfile'
  static description = `Update the old adonisrc.json file for the new adonisrc.ts file`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [upgradeRcFile()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
