import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function appConfig(): PatcherFactory {
  return (runner) => new AppConfig(runner)
}

/**
 * Rewrite the app.ts file to use the new API
 */
export class AppConfig extends ConfigUpdaterPatcher {
  static patcherName = 'app-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/app.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Core/Server',
      defineConfigImport: '@adonisjs/core/http',
      variableName: 'http',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/app.ts file')

    this.exit()
  }
}
