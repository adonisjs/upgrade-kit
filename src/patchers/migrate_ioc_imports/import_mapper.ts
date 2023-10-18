import { ImportMap } from '../../types/index.js'
import { newImportsMapping } from '../../rewrite_maps.js'

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
      (!!this.#importsMapping[oldModule]['*'] || !!this.#importsMapping[oldModule]['default'])
    )
  }

  /**
   * If the given named import should be renamed
   */
  shouldRenameNamedImport(oldModule: string, namedImport: string) {
    return this.shouldBeRewritten(oldModule) && !!this.#importsMapping[oldModule][namedImport]
  }

  /**
   * If the default import is moved to a new module
   */
  shouldMoveDefaultImport(oldModule: string) {
    return (
      this.shouldBeRewritten(oldModule) &&
      !!this.#importsMapping[oldModule]['default'] &&
      !!this.#importsMapping[oldModule]['default'].newPath
    )
  }

  /**
   * If the given named import should be moved to a new module
   */
  shouldMoveNamedImport(oldModule: string, namedImport: string) {
    const shouldMoveDefaultImport = this.shouldMoveDefaultImport(oldModule)
    if (shouldMoveDefaultImport) {
      return true
    }

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
    return this.#importsMapping[oldModule][namedImport]?.newName || namedImport
  }

  /**
   * Returns the new name for the default import
   */
  getNewDefaultImportName(oldModule: string) {
    return this.#importsMapping[oldModule]['default'].newName!
  }

  /**
   * Get the new module specifier for the given module ( and named import )
   */
  getNewModuleSpecifier(oldModule: string, namedImport?: string) {
    const moduleEntry = this.#importsMapping[oldModule]

    let defaultEntry = moduleEntry['default']
    let wildcardEntry = moduleEntry['*']

    if (namedImport === undefined) {
      return (defaultEntry || wildcardEntry).newPath!
    }

    let namedEntry = moduleEntry[namedImport]
    let entry = namedEntry || wildcardEntry
    return entry.newPath!
  }
}
