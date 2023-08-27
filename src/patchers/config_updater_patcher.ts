import { join } from 'node:path'
import { BasePatcher } from './base_patcher.js'
import { SourceFile, SyntaxKind } from 'ts-morph'

export class ConfigUpdaterPatcher extends BasePatcher {
  getConfigFile(path: string) {
    const configAppPath = join(this.runner.project.getRootDirectories()[0].getPath(), path)

    const file = this.runner.project.getSourceFile(configAppPath)
    if (!file) {
      this.logger.warning(`${path} file not found`)
    }

    return file
  }

  replaceOldLiteralConfigWithDefineConfig(options: {
    file: SourceFile
    oldTypeImport: string
    defineConfigImport: string
    variableName: string
  }) {
    /**
     * Remove old config typing import statement
     */
    const oldConfigTypeImport = options.file.getImportDeclaration(options.oldTypeImport)
    if (oldConfigTypeImport) {
      oldConfigTypeImport.remove()
    }

    /**
     * Add defineConfig import
     */
    options.file.addImportDeclaration({
      moduleSpecifier: options.defineConfigImport,
      namedImports: ['defineConfig'],
    })

    /**
     * Replace the simple Object Literal with a defineConfig call
     */
    const configVariable = options.file.getVariableDeclarationOrThrow(options.variableName)
    const variableValue = configVariable.getInitializerIfKindOrThrow(
      SyntaxKind.ObjectLiteralExpression
    )

    configVariable.replaceWithText(
      `${options.variableName} = defineConfig(${variableValue.getText()})`
    )
  }
}
