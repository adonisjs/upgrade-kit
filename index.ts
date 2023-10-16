import { Kernel, ListLoader } from '@adonisjs/ace'

import { UpgradePackages } from './src/commands/upgrade_packages.js'
import { UpgradeModuleSystem } from './src/commands/upgrade_module_system.js'

export const kernel = Kernel.create().addLoader(
  new ListLoader([UpgradePackages, UpgradeModuleSystem])
)
