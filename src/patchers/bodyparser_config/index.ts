import { join } from 'node:path'
import { SyntaxKind } from 'ts-morph'

import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'

export function bodyparserConfig(): PatcherFactory {
  return (runner) => new BodyparserConfig(runner)
}

/**
 * Rewrite the config/bodyparser.ts file to use the new API
 */
export class BodyparserConfig extends BasePatcher {
  static patcherName = 'bodyparser-config'

  async invoke() {
    super.invoke()

    /**
     * Get config/bodyparser.ts file
     */
    const configAppPath = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      'config/bodyparser.ts'
    )

    const file = this.runner.project.getSourceFile(configAppPath)
    if (!file) {
      this.logger.warning('config/bodyparser.ts file not found. Skipping patching')
      return
    }

    /**
     * Delete BodyParserConfig import since we gonna use defineConfig
     */
    const configTypeImport = file.getImportDeclaration('@ioc:Adonis/Core/Server')
    if (configTypeImport) {
      configTypeImport.remove()
    }

    /**
     * Add defineConfig import
     */
    file.addImportDeclaration({
      moduleSpecifier: '@adonisjs/core/bodyparser',
      namedImports: ['defineConfig'],
    })

    /**
     * Wrap the content of export const bodyParserConfig inside defineConfig
     */
    const config = file.getVariableDeclarationOrThrow('bodyParserConfig')
    const variableValue = config.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)

    config.replaceWithText(`bodyParserConfig = defineConfig(${variableValue.getText()})`)

    this.logger.info('Updated config/bodyparser.ts file')

    await this.formatFile(file).save()

    this.exit()
  }
}
