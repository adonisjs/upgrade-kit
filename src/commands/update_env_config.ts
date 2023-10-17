import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { envConfig } from '../patchers/env_config/index.js'

export class UpgradeEnvConfig extends BaseCommand {
  static commandName = 'upgrade-env-config'
  static description = `Update the env.ts file to be compatible with the new API.`

  async run() {
    this.displayHeading()

    await new Runner({ patchers: [envConfig()], projectPath: this.projectPath }).run()

    this.displayFooter()
  }
}
