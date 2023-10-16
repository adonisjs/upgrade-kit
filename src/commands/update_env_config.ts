import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { envConfig } from '../patchers/env_config/index.js'

export class UpdateEnvConfig extends BaseCommand {
  static commandName = 'update-env-config'
  static description = `updates the env.ts file to be compatible with the new API.`

  async run() {
    this.displayHeading()

    await new Runner({ patchers: [envConfig()], projectPath: this.projectPath }).run()

    this.displayFooter()
  }
}
