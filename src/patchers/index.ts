import { AddJsExtensions } from './add_js_extensions/index.js'
import { AddTypeModule } from './add_type_module/index.js'
import { AppConfig } from './app_config/index.js'
import { EnvConfig } from './env_config/index.js'
import { EventsTyping } from './events_typing/index.js'
import { MigrateAliasesToSubpath } from './migrate_aliases_to_subpath/index.js'
import { MigrateRcFile } from './migrate_rc_file/index.js'
import { RewriteIocImports } from './rewrite_ioc_imports/index.js'
import { UpdateAce } from './update_ace/update_ace.js'

export const patchers = [
  AddJsExtensions,
  AddTypeModule,
  EnvConfig,
  EventsTyping,
  MigrateAliasesToSubpath,
  RewriteIocImports,
  AppConfig,
  UpdateAce,
  MigrateRcFile,
]
