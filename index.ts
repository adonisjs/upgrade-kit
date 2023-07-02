import { Kernel, ListLoader } from '@adonisjs/ace'
import { MigrateImports } from './src/commands/migrate_imports.js'
import { MigrateConfigs } from './src/commands/migrate_configs.js'
import { MigrateAll } from './src/commands/migrate_all.js'

export const kernel = Kernel.create().addLoader(
  new ListLoader([MigrateImports, MigrateConfigs, MigrateAll])
)
