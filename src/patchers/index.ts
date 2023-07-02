import { AddJsExtensions } from './add_js_extensions/index.js'
import { AddTypeModule } from './add_type_module/index.js'
import { EnvConfig } from './env_config/index.js'
import { EventsTyping } from './events_typing/index.js'
import { MigrateAliasesToSubpath } from './migrate_aliases_to_subpath/index.js'
import { RewriteIocImports } from './rewrite_ioc_imports/index.js'

export const patchers = [
  AddJsExtensions,
  AddTypeModule,
  EnvConfig,
  EventsTyping,
  MigrateAliasesToSubpath,
  RewriteIocImports,
]
