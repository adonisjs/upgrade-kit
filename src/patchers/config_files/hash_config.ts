import dedent from 'dedent'
import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'
import { join } from 'node:path'

export function hashConfig(): PatcherFactory {
  return (runner) => new HashConfig(runner)
}

/**
 * Rewrite the config/hash.ts file to use the new API
 */
export class HashConfig extends ConfigUpdaterPatcher {
  static patcherName = 'hash-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/hash.ts')
    if (!file) return

    this.replaceOldLiteralConfigWithDefineConfig({
      file,
      oldTypeImport: '@ioc:Adonis/Core/Hash',
      defineConfigImport: '@adonisjs/core/hash',
      variableName: 'hashConfig',
    })

    /**
     * Also add the types augmentation
     */
    const typesAugmentation = dedent`
      declare module '@adonisjs/core/types' {
        export interface HashersList extends InferHashers<typeof hashConfig> {}
      }
    `
    file.insertText(file.getEnd(), '\n\n' + typesAugmentation)

    /**
     * And remove the old one
     */
    const hashContractFile = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      '/contracts/hash.ts'
    )
    await this.runner.project.getSourceFile(hashContractFile)?.deleteImmediately()

    await this.formatFile(file).save()
    this.logger.info('Updated config/hash.ts file')

    this.exit()
  }
}
