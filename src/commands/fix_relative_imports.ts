import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { fixRelativeImports } from '../patchers/fix_relative_imports/index.js'

export class FixRelativeImports extends BaseCommand {
  static commandName = 'fix-relative-imports'
  static description = `Migrate from CJS imports to ESM imports ( add .js extension for example ).`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [fixRelativeImports()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
