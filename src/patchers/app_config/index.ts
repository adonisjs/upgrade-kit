import { SyntaxKind } from 'ts-morph'
import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'
import { join } from 'node:path'

export function appConfig(): PatcherFactory {
  return (runner) => new AppConfig(runner)
}

/**
 * Rewrite the env.ts file to use the new API
 */
export class AppConfig extends BasePatcher {
  static patcherName = 'app-config'

  invoke() {
    super.invoke()

    /**
     * Get config/app.ts file
     */
    const configAppPath = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      'config/app.ts'
    )
    const file = this.runner.project.getSourceFile(configAppPath)
    if (!file) {
      this.logger.warning('config/app.ts file not found. Skipping patching')
      return
    }

    /**
     * Delete ServerConfig import since we gonna use defineConfig
     */
    const serverConfigImport = file.getImportDeclaration('@ioc:Adonis/Core/Server')
    if (serverConfigImport) {
      serverConfigImport.remove()
    }

    /**
     * Add defineConfig import
     */
    file.addImportDeclaration({
      moduleSpecifier: '@adonisjs/core/http',
      namedImports: ['defineConfig'],
    })

    /**
     * Wrap the content of export const http inside defineConfig
     */
    const httpConfig = file.getVariableDeclarationOrThrow('http')
    const variableValue = httpConfig.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)

    httpConfig.replaceWithText(`http = defineConfig(${variableValue.getText()})`)

    this.exit()
  }
}
