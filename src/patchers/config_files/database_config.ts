import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function databaseConfig(): PatcherFactory {
  return (runner) => new DatabaseConfig(runner)
}

/**
 * Rewrite the config/database.ts file to use the new API
 */
export class DatabaseConfig extends ConfigUpdaterPatcher {
  static patcherName = 'database-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/database.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Lucid/Database',
      defineConfigImport: '@adonisjs/lucid',
      variableName: 'databaseConfig',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/database.ts file')

    this.exit()
  }
}
