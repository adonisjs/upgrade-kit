import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { updateModuleSystem } from '../patchers/update_module_system/index.js'

export class UpgradeModuleSystem extends BaseCommand {
  static commandName = 'upgrade-module-system'
  static description = `Moves your application from CommonJS to ESM context.`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [updateModuleSystem()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
