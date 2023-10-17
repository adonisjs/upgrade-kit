import { Kernel, ListLoader } from '@adonisjs/ace'

import { UpgradeRcFile } from './src/commands/upgrade_rc_file.js'
import { UpgradeAliases } from './src/commands/upgrade_aliases.js'
import { UpgradePackages } from './src/commands/upgrade_packages.js'
import { UpgradeEnvConfig } from './src/commands/update_env_config.js'
import { MigrateIocImports } from './src/commands/migrate_ioc_imports.js'
import { UpgradeEntrypoints } from './src/commands/upgrade_entrypoints.js'
import { FixRelativeImports } from './src/commands/fix_relative_imports.js'
import { UpgradeConfigFiles } from './src/commands/upgrade_config_files.js'
import { UpgradeModuleSystem } from './src/commands/upgrade_module_system.js'
import { UpgradeEslintPrettier } from './src/commands/upgrade_eslint_prettier.js'
import { UpgradeCommandOptions } from './src/commands/upgrade_command_options.js'

export const kernel = Kernel.create().addLoader(
  new ListLoader([
    UpgradePackages,
    UpgradeModuleSystem,
    UpgradeAliases,
    MigrateIocImports,
    FixRelativeImports,
    UpgradeEnvConfig,
    UpgradeEntrypoints,
    UpgradeRcFile,
    UpgradeEslintPrettier,
    UpgradeConfigFiles,
    UpgradeCommandOptions,
  ])
)
