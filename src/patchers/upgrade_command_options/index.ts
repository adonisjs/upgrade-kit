import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'
import { SyntaxKind } from 'ts-morph'
import dedent from 'dedent'

export function upgradeCommandOptions(): PatcherFactory {
  return (runner) => new UpgradeCommandOptions(runner)
}

export class UpgradeCommandOptions extends BasePatcher {
  static patcherName = 'upgrade-command-options'

  async invoke() {
    super.invoke()

    const tsFiles = this.project.getSourceFiles('**/*/commands/**/*.ts')

    for (let tsFile of tsFiles) {
      const defaultExport = tsFile.getDefaultExportSymbol()
      const isCommandFile = defaultExport?.getDeclarations()?.[0]?.getText().includes('BaseCommand')
      if (!isCommandFile) {
        return
      }

      const commandClass = defaultExport?.getDeclarations()?.[0].asKind(SyntaxKind.ClassDeclaration)
      const commandSettings = defaultExport
        ?.getDeclarations()?.[0]
        ?.getDescendantsOfKind(SyntaxKind.PropertyDeclaration)
        ?.find((node) => node.getName() === 'settings')

      if (!commandSettings) {
        return
      }

      /**
       * Get loadApp and stayAlive from `settings`
       */
      const loadApp = commandSettings
        ?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)
        ?.getProperty('loadApp')

      const stayAlive = commandSettings
        ?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)
        ?.getProperty('stayAlive')

      /**
       * Replace `settings` with `options` and keep old values
       */
      commandClass?.addProperty({
        name: 'options: CommandOptions',
        initializer: dedent`{
          loadApp: ${loadApp?.getText().includes('true') ? 'true' : 'false'},
          staysAlive: ${stayAlive?.getText().includes('true') ? 'true' : 'false'},
        }`,
        isStatic: true,
      })

      tsFile.addImportDeclaration({
        moduleSpecifier: '@adonisjs/core/types/ace',
        namedImports: [{ name: 'CommandOptions' }],
      })

      commandSettings.remove()
    }

    this.exit()
  }
}
