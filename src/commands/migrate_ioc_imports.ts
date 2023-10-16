import { Runner } from '../runner.js'
import { BaseCommand } from './base_command.js'
import { migrateIocImports } from '../patchers/rewrite_ioc_imports/index.js'

export class MigrateIocImports extends BaseCommand {
  static commandName = 'migrate-ioc-imports'
  static description = `Removes the existing @ioc prefixed imports from your application source in favor of new standard ESM imports.`

  async run() {
    this.displayHeading()

    await new Runner({
      patchers: [migrateIocImports()],
      projectPath: this.projectPath,
    }).run()

    this.displayFooter()
  }
}
