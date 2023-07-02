import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'

export function addTypeModule(): PatcherFactory {
  return (runner) => new AddTypeModule(runner)
}

/**
 * Add type: module to package.json
 */
export class AddTypeModule extends BasePatcher {
  static patcherName = 'add-type-module'

  invoke(): void {
    super.invoke()

    this.runner.pkgJsonFile.set('type', 'module')
    this.runner.pkgJsonFile.save()

    this.logger.info('Added type: module to package.json')

    this.exit()
  }
}
