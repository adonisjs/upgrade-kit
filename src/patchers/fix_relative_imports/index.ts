import { extname } from 'node:path'
import { ImportDeclaration } from 'ts-morph'

import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'

export function fixRelativeImports(): PatcherFactory {
  return (runner) => new FixRelativeImports(runner)
}

/**
 * Goal is to add .js extension to all the import paths that are
 * relative since we are going to use ES modules.
 *
 * We also need to add `index.js` to the imports that are directories since
 * it's not possible with ESM
 */
export class FixRelativeImports extends BasePatcher {
  static patcherName = 'add-js-extensions'

  #changes: {
    importNode: ImportDeclaration
    newModuleSpecifier: string
  }[] = []

  invoke(): void {
    super.invoke()

    const tsFiles = this.project.getSourceFiles()

    /**
     * Keep track of all the changes and then apply them
     */
    for (let tsFile of tsFiles) {
      const imports = tsFile.getImportDeclarations()

      for (let importNode of imports) {
        const moduleSpecifier = importNode.getModuleSpecifierValue()

        const isRelativeImport = moduleSpecifier.startsWith('.')
        const hasExtension = !!extname(moduleSpecifier)

        if (!isRelativeImport || hasExtension) {
          continue
        }

        const importedSourcePath = importNode.getModuleSpecifierSourceFile()?.getFilePath()

        if (importedSourcePath?.endsWith('index.ts') && !moduleSpecifier.endsWith('index')) {
          this.#changes.push({ importNode, newModuleSpecifier: `${moduleSpecifier}/index.js` })
          continue
        }

        this.#changes.push({ importNode, newModuleSpecifier: `${moduleSpecifier}.js` })
      }
    }

    /**
     * Apply all changes at once. This is important to keep
     * good performances
     */
    for (let change of this.#changes) {
      change.importNode.setModuleSpecifier(change.newModuleSpecifier)
    }

    this.exit()
  }
}