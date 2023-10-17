import { SyntaxKind } from 'ts-morph'
import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'

export function shieldConfig(): PatcherFactory {
  return (runner) => new ShieldConfig(runner)
}

/**
 * Rewrite the config/shield.ts file to use the new API
 */
export class ShieldConfig extends ConfigUpdaterPatcher {
  static patcherName = 'shield-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/shield.ts')
    if (!file) return

    /**
     * Take each configuration section exported from the old file
     * and create a new object literal that will include all
     */
    const exportedDeclarations = file.getExportedDeclarations()
    const sections = ['csp', 'csrf', 'xframe', 'hsts', 'contentTypeSniffing', 'dnsPrefetchControl']

    let configObjectLiteral = '{\n'

    sections.forEach((sectionName) => {
      const symbols = exportedDeclarations.get(sectionName)
      if (!symbols) return

      const symbol = symbols[0].getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)
      configObjectLiteral += sectionName + ': ' + symbol[0].getText() + ',\n'
    })

    configObjectLiteral += '}'

    /**
     * Write the new file
     */
    const newContent = `
    import env from '#start/env'
    import { defineConfig } from '@adonisjs/shield'

    export default defineConfig(${configObjectLiteral})
    `
    file.replaceWithText(newContent)
    await this.formatFile(file).save()

    this.logger.info('Updated config/shield.ts file')

    this.exit()
  }
}
