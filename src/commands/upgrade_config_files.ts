import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { appConfig } from '../patchers/config_files/app_config.js'
import { corsConfig } from '../patchers/config_files/cors_config.js'
import { staticConfig } from '../patchers/config_files/static_config.js'
import { sessionConfig } from '../patchers/config_files/session_config.js'
import { bodyparserConfig } from '../patchers/config_files/bodyparser_config.js'
import { databaseConfig } from '../patchers/config_files/database_config.js'
import { hashConfig } from '../patchers/config_files/hash_config.js'
import { shieldConfig } from '../patchers/config_files/shield_config.js'
import { mailConfig } from '../patchers/config_files/mail_config.js'
import { allyConfig } from '../patchers/config_files/ally_config.js'

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
        hashConfig(),
        shieldConfig(),
        mailConfig(),
        allyConfig(),
      ],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
