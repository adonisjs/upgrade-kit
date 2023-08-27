import { join } from 'node:path'
import { SyntaxKind } from 'ts-morph'

import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'

export function sessionConfig(): PatcherFactory {
  return (runner) => new SessionConfig(runner)
}

/**
 * Rewrite the config/session.ts file to use the new API
 */
export class SessionConfig extends BasePatcher {
  static patcherName = 'session-config'

  async invoke() {
    super.invoke()

    /**
     * Get config/session.ts file
     */
    const configAppPath = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      'config/session.ts'
    )

    const file = this.runner.project.getSourceFile(configAppPath)
    if (!file) {
      this.logger.warning('config/session.ts file not found. Skipping patching')
      return
    }

    /**
     * Delete SessionConfig import since we gonna use defineConfig
     */
    const configTypeImport = file.getImportDeclaration('@ioc:Adonis/Addons/Session')
    if (configTypeImport) {
      configTypeImport.remove()
    }

    /**
     * Add defineConfig import
     */
    file.addImportDeclaration({
      moduleSpecifier: '@adonisjs/session',
      namedImports: ['defineConfig'],
    })

    /**
     * Wrap the content of export const bodyParserConfig inside defineConfig
     */
    const config = file.getVariableDeclarationOrThrow('sessionConfig')
    const variableValue = config.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)

    config.replaceWithText(`sessionConfig = defineConfig(${variableValue.getText()})`)

    this.logger.info('Updated config/session.ts file')

    await this.formatFile(file).save()

    this.exit()
  }
}
