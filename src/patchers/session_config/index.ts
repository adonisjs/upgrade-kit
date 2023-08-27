import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function sessionConfig(): PatcherFactory {
  return (runner) => new SessionConfig(runner)
}

/**
 * Rewrite the config/session.ts file to use the new API
 */
export class SessionConfig extends ConfigUpdaterPatcher {
  static patcherName = 'session-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/session.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Addons/Session',
      defineConfigImport: '@adonisjs/session',
      variableName: 'sessionConfig',
    })

    await this.formatFile(file).save()
    this.logger.info('Updated config/session.ts file')

    this.exit()
  }
}
