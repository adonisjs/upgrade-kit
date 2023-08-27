import { SyntaxKind } from 'ts-morph'
import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'

export function envConfig(): PatcherFactory {
  return (runner) => new EnvConfig(runner)
}

/**
 * Rewrite the env.ts file to use the new API
 */
export class EnvConfig extends BasePatcher {
  static patcherName = 'env-config'

  invoke() {
    super.invoke()

    /**
     * Get env.ts file
     */
    const file = this.runner.project.getSourceFile('env.ts')
    if (!file) {
      this.logger.warning('env.ts file not found. Skipping patching')
      return
    }

    /**
     * Remove all import statements
     */
    file.getImportDeclarations().forEach((imp) => imp.remove())

    /**
     * Insert the new one
     */
    file.addImportDeclaration({
      moduleSpecifier: '@adonisjs/core/env',
      namedImports: ['Env'],
    })

    /**
     * Find the call to Env.rules() and take the first argument
     */
    const callExpressions = file.getDescendantsOfKind(SyntaxKind.CallExpression)
    const envRulesCall = callExpressions.find(
      (exp) => exp.getExpression().getText() === 'Env.rules'
    )

    if (!envRulesCall) {
      this.logger.warning('Env.rules() call not found. Skipping patching')
      return
    }

    const firstArgument = envRulesCall.getArguments()[0]

    /**
     * Finally rewrite the expression
     */
    envRulesCall.replaceWithText((writer) => {
      writer
        .writeLine('await Env.create(new URL("../", import.meta.url), {')
        .writeLine(firstArgument.getText().slice(2, -2))
        .writeLine('})')
    })

    /**
     * And delete the old contracts/env.ts
     */
    this.runner.project.getSourceFile('contracts/env.ts')?.delete()

    this.logger.info('Updated env.ts file')

    this.exit()
  }
}
