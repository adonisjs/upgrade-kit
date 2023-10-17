import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { appConfig } from '../patchers/app_config/index.js'
import { corsConfig } from '../patchers/cors_config/index.js'
import { staticConfig } from '../patchers/static_config/index.js'
import { sessionConfig } from '../patchers/session_config/index.js'
import { bodyparserConfig } from '../patchers/bodyparser_config/index.js'

export class UpgradeConfigFiles extends BaseCommand {
  static commandName = `upgrade-config-files`
  static description = 'Upgrade AdonisJS config/*.ts files to match the new API.'

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [appConfig(), bodyparserConfig(), corsConfig(), sessionConfig(), staticConfig()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
