import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function staticConfig(): PatcherFactory {
  return (runner) => new StaticConfig(runner)
}

/**
 * Rewrite the config/static.ts file to use the new API
 */
export class StaticConfig extends ConfigUpdaterPatcher {
  static patcherName = 'static-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/static.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Core/Static',
      defineConfigImport: '@adonisjs/static',
      variableName: 'staticConfig',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/static.ts file')

    this.exit()
  }
}
