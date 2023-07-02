import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'

export function addJsExtensions(): PatcherFactory {
  return (runner) => new AddJsExtensions(runner)
}

/**
 * Goal is to add .js extension to all the import paths that are
 * relative since we are going to use ES modules.
 *
 * We also need to add `index.js` to the imports that are directories since
 * it's not possible with ESM
 */
export class AddJsExtensions extends BasePatcher {
  static patcherName = 'add-js-extensions'

  invoke(): void {
    super.invoke()

    const tsFiles = this.project.getSourceFiles()

    for (let tsFile of tsFiles) {
      const imports = tsFile.getImportDeclarations()

      for (let importNode of imports) {
        const moduleSpecifier = importNode.getModuleSpecifierValue()

        const isRelativeImport = moduleSpecifier.startsWith('.')
        const hasJsExtension = moduleSpecifier.endsWith('.js')

        if (!isRelativeImport || hasJsExtension) {
          continue
        }

        const importedSourcePath = importNode.getModuleSpecifierSourceFile()?.getFilePath()

        if (importedSourcePath?.endsWith('index.ts') && !moduleSpecifier.endsWith('index.js')) {
          importNode.setModuleSpecifier(`${moduleSpecifier}/index.js`)
          continue
        }

        importNode.setModuleSpecifier(`${moduleSpecifier}.js`)
      }
    }

    this.exit()
  }
}
