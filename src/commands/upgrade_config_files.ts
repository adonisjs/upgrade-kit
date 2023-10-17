import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { appConfig } from '../patchers/config_files/app_config.js'
import { corsConfig } from '../patchers/config_files/cors_config.js'
import { staticConfig } from '../patchers/config_files/static_config.js'
import { sessionConfig } from '../patchers/config_files/session_config.js'
import { bodyparserConfig } from '../patchers/config_files/bodyparser_config.js'
import { databaseConfig } from '../patchers/config_files/database_config.js'

export class UpgradeConfigFiles extends BaseCommand {
  static commandName = `upgrade-config-files`
  static description = 'Upgrade AdonisJS config/*.ts files to match the new API.'

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [
        appConfig(),
        bodyparserConfig(),
        corsConfig(),
        sessionConfig(),
        staticConfig(),
        databaseConfig(),
      ],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
