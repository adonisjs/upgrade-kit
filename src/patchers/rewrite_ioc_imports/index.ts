import { ImportDeclaration, ImportSpecifier, SourceFile } from 'ts-morph'

import { Runner } from '../../runner.js'
import { BasePatcher } from '../base_patcher.js'
import { ImportMapper } from './import_mapper.js'
import { PatcherFactory } from '../../types/index.js'
import { newImportsMapping } from '../../rewrite_maps.js'
import { RewriteIocImportsOptions } from '../../types/index.js'

export function rewriteIocImports(options?: RewriteIocImportsOptions): PatcherFactory {
  return (runner) => new RewriteIocImports(runner, options)
}

export class RewriteIocImports extends BasePatcher {
  static patcherName = 'rewrite-ioc-imports'

  #options: RewriteIocImportsOptions
  #importMapper: ImportMapper

  constructor(runner: Runner, options?: RewriteIocImportsOptions) {
    super(runner)

    this.#options = options ?? {}
    this.#importMapper = new ImportMapper(this.#options.importMap ?? newImportsMapping)
  }

  /**
   * Only rename a named import and update all the references to the new name
   */
  #renameNamedImport(moduleSpecifier: string, namedImport: ImportSpecifier) {
    /**
     * First we rename the named import
     */
    const oldName = namedImport.getName()
    namedImport.setName(this.#importMapper.getNewNamedImportName(moduleSpecifier, oldName)!)

    /**
     * Then we alias the named import to the old name
     */
    namedImport.setAlias(oldName)

    /**
     * Then we remove the alias with rename.
     * Doing this hack will make sure all the references to the old name
     * are now pointing to the new name.
     */
    namedImport.removeAliasWithRename()
  }

  /**
   * Move a named import to a new module. And maybe rename it too
   */
  #moveOutNamedImport(file: SourceFile, moduleSpecifier: string, namedImport: ImportSpecifier) {
    const name = namedImport.getName()

    const newNamedImportSpecifier = this.#importMapper.getNewModuleSpecifier(moduleSpecifier, name)
    const shouldRename = this.#importMapper.shouldRenameNamedImport(moduleSpecifier, name)
    const newNamedImportName = this.#importMapper.getNewNamedImportName(moduleSpecifier, name)

    /**
     * First we rename the named import before moving it out
     */
    if (shouldRename) {
      this.#renameNamedImport(moduleSpecifier, namedImport)
    }

    /**
     * Then we add a new import declaration
     */
    file.addImportDeclaration({
      moduleSpecifier: newNamedImportSpecifier,
      namedImports: [{ name: shouldRename ? newNamedImportName! : name }],
    })

    /**
     * And finally we remove the named import from the original import declaration
     */
    namedImport.remove()
  }

  #processImportDeclaration(file: SourceFile, importDeclaration: ImportDeclaration) {
    const mod = importDeclaration.getModuleSpecifierValue()

    /**
     * First we rename the module specifier
     */
    const newSpecifier = this.#importMapper.getNewModuleSpecifier(mod)
    importDeclaration.setModuleSpecifier(newSpecifier)

    const shouldOnlyRenameSpecifier = this.#importMapper.shouldOnlyRenameModuleSpecifier(mod)
    if (shouldOnlyRenameSpecifier) {
      return
    }

    /**
     * Update default import if needed
     */
    const defaultImport = importDeclaration.getDefaultImport()
    if (defaultImport && this.#importMapper.shouldMoveDefaultImport(mod)) {
      defaultImport.rename(this.#importMapper.getNewDefaultImportName(mod)!)
    }

    /**
     * Then we start analyzing the named imports
     */
    const namedImports = importDeclaration.getNamedImports()
    for (let namedImport of namedImports) {
      const name = namedImport.getName()
      if (this.#importMapper.shouldMoveNamedImport(mod, name)) {
        this.#moveOutNamedImport(file, mod, namedImport)
        continue
      }

      if (this.#importMapper.shouldRenameNamedImport(mod, name)) {
        this.#renameNamedImport(mod, namedImport)
        continue
      }
    }

    /**
     * If updated import declaration has no named imports or default import
     * then we remove it
     */
    const hasNamedImports = importDeclaration.getNamedImports().length > 0
    const hasDefaultImport = !!importDeclaration.getDefaultImport()

    if (!hasNamedImports && !hasDefaultImport) {
      importDeclaration.remove()
    }
  }

  /**
   * Process a single file
   */
  async #processFile(file: SourceFile) {
    const importsDeclarations = file.getImportDeclarations()

    for (let importDeclaration of importsDeclarations) {
      const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue()
      if (!this.#importMapper.shouldBeRewritten(moduleSpecifierValue)) {
        continue
      }

      this.#processImportDeclaration(file, importDeclaration)
    }
  }

  /**
   * Invoke the patcher
   */
  invoke() {
    super.invoke()

    const tsFiles = this.project.getSourceFiles()

    for (let file of tsFiles) {
      this.#processFile(file)
    }

    const modifiedFiles = this.project.getSourceFiles().filter((file) => !file.isSaved())

    this.logger.info(`Patched ${modifiedFiles.length} files`)

    this.exit()
  }
}
