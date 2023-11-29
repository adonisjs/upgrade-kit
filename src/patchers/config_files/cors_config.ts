import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function corsConfig(): PatcherFactory {
  return (runner) => new CorsConfig(runner)
}

/**
 * Rewrite the config/cors.ts file to use the new API
 */
export class CorsConfig extends ConfigUpdaterPatcher {
  static patcherName = 'cors-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/cors.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Core/Cors',
      defineConfigImport: '@adonisjs/cors',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/cors.ts file')

    this.exit()
  }
}
