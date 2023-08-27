import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function bodyparserConfig(): PatcherFactory {
  return (runner) => new BodyparserConfig(runner)
}

/**
 * Rewrite the config/bodyparser.ts file to use the new API
 */
export class BodyparserConfig extends ConfigUpdaterPatcher {
  static patcherName = 'bodyparser-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/bodyparser.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Core/Server',
      defineConfigImport: '@adonisjs/core/bodyparser',
      variableName: 'bodyParserConfig',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/bodyparser.ts file')

    this.exit()
  }
}
