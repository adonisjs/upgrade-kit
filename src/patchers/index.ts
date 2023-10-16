import { AppConfig } from './app_config/index.js'
import { EnvConfig } from './env_config/index.js'
import { CorsConfig } from './cors_config/index.js'
import { UpdateAce } from './update_ace/update_ace.js'
import { AddBinFiles } from './add_bin_files/index.js'
import { StaticConfig } from './static_config/index.js'
import { EventsTyping } from './events_typing/index.js'
import { SessionConfig } from './session_config/index.js'
import { MigrateRcFile } from './migrate_rc_file/index.js'
import { UpdateModuleSystem } from './update_module_system/index.js'
import { AddJsExtensions } from './add_js_extensions/index.js'
import { BodyparserConfig } from './bodyparser_config/index.js'
import { MigrateIocImports } from './rewrite_ioc_imports/index.js'
import { UpgradeAliases } from './upgrade_aliases/index.js'

export const patchers = [
  AddJsExtensions,
  UpdateModuleSystem,
  EnvConfig,
  EventsTyping,
  UpgradeAliases,
  MigrateIocImports,
  AppConfig,
  UpdateAce,
  MigrateRcFile,
  AddBinFiles,
  BodyparserConfig,
  SessionConfig,
  StaticConfig,
  CorsConfig,
]
