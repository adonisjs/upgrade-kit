import { ImportMap } from '../../types/index.js'
import { newImportsMapping } from './default_import_mapper.js'

export class ImportMapper {
  #importsMapping = newImportsMapping

  constructor(importMapping: ImportMap) {
    this.#importsMapping = importMapping
  }

  /**
   * If the module is in the import mapping and
   * therefore should be rewritten
   */
  shouldBeRewritten(oldModule: string) {
    return oldModule in this.#importsMapping
  }

  /**
   * If only module specifier need to be renamed,
   * and no named imports need to be renamed or moved
   */
  shouldOnlyRenameModuleSpecifier(oldModule: string) {
    return (
      this.shouldBeRewritten(oldModule) &&
      Object.keys(this.#importsMapping[oldModule]).length === 1 &&
      !!this.#importsMapping[oldModule]['*']
    )
  }

  /**
   * If the given named import should be renamed
   */
  shouldRenameNamedImport(oldModule: string, namedImport: string) {
    return this.shouldBeRewritten(oldModule) && !!this.#importsMapping[oldModule][namedImport]
  }

  /**
   * If the given named import should be moved to a new module
   */
  shouldMoveNamedImport(oldModule: string, namedImport: string) {
    return (
      this.shouldBeRewritten(oldModule) &&
      !!this.#importsMapping[oldModule][namedImport] &&
      !!this.#importsMapping[oldModule][namedImport].newPath
    )
  }

  /**
   * Get the default remapping for the given module
   */
  getDefaultRemapping(oldModule: string) {
    return this.#importsMapping[oldModule]['*']
  }

  /**
   * Returns the new name for the given named import
   */
  getNewNamedImportName(oldModule: string, namedImport: string) {
    return this.#importsMapping[oldModule][namedImport].newName
  }

  /**
   * Get the new module specifier for the given module ( and named import )
   */
  getNewModuleSpecifier(oldModule: string, namedImport?: string) {
    let newPath = this.#importsMapping[oldModule][namedImport ?? '*'].newPath
    newPath = newPath || this.getDefaultRemapping(oldModule).newPath
    return newPath!
  }
}
