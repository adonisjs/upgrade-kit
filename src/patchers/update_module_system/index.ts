import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'

export function updateModuleSystem(): PatcherFactory {
  return (runner) => new UpdateModuleSystem(runner)
}

/**
 * - Add type: module to package.json
 * - Update tsconfig.json
 */
export class UpdateModuleSystem extends BasePatcher {
  static patcherName = 'update-module-system'

  async #addTypeModuleToPkgJson() {
    this.runner.pkgJsonFile.set('type', 'module')
    await this.runner.pkgJsonFile.save()

    this.logger.info('Added type: module to package.json')
  }

  async #updateTsConfig() {
    const tsConfig = this.runner.tsConfigFile.get()
    tsConfig.extends = '@adonisjs/tsconfig/tsconfig.app.json'

    tsConfig.compilerOptions.types = (tsConfig.compilerOptions.types ?? []).filter(
      (type: string) => !type.startsWith('@adonisjs') && !type.startsWith('@japa')
    )

    tsConfig.compilerOptions.strictPropertyInitialization = false

    tsConfig.compilerOptions.module = 'Node16'
    tsConfig.compilerOptions.moduleResolution = 'Node16'

    await this.runner.tsConfigFile.save()
    this.logger.info('Updated tsconfig.json with new extends and types')
  }

  async invoke(): Promise<void> {
    super.invoke()

    await Promise.all([this.#addTypeModuleToPkgJson(), this.#updateTsConfig()])

    this.exit()
  }
}
