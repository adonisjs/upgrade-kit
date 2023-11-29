import dedent from 'dedent'
import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'
import { join } from 'node:path'

export function allyConfig(): PatcherFactory {
  return (runner) => new AllyConfig(runner)
}

/**
 * Rewrite the config/hash.ts file to use the new API
 */
export class AllyConfig extends ConfigUpdaterPatcher {
  static patcherName = 'ally-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/ally.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Addons/Ally',
      defineConfigImport: '@adonisjs/ally',
    })

    /**
     * Move to config providers
     */
    this.moveToConfigProvider({
      file,
      driversImport: { module: '@adonisjs/ally', named: 'services' },
      driversToTransform: [
        'discord',
        'facebook',
        'github',
        'google',
        'linkedin',
        'spotify',
        'twitter',
      ],
      inList: false,
    })

    /**
     * Also add the types augmentation
     */
    const typesAugmentation = dedent`
      declare module '@adonisjs/ally/types' {
        interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
      }
    `
    file.insertText(file.getEnd(), '\n\n' + typesAugmentation)

    /**
     * And remove the old one
     */
    const allyContractFile = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      '/contracts/ally.ts'
    )
    await this.runner.project.getSourceFile(allyContractFile)?.deleteImmediately()

    await this.formatFile(file).save()
    this.logger.info('Updated config/ally.ts file')

    this.exit()
  }
}
