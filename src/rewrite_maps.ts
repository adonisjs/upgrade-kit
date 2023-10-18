import { ImportMap } from './types/index.js'

/**
 * Map of old import paths to new import paths
 * used by the RewriteIocImports patcher
 */
export const newImportsMapping: ImportMap = {
  /**
   * ------------------------------------------------------
   * Core
   * ------------------------------------------------------
   */
  '@adonisjs/core/build/standalone': {
    'BaseCommand': {
      newName: 'BaseCommand',
      newPath: '@adonisjs/core/ace',
    },
    'Exception': {
      newPath: '@adonisjs/core/exceptions',
    },
    'HttpContext': {
      newPath: '@adonisjs/core/http',
    },
    '*': {
      newPath: '@adonisjs/core',
    },
  },
  '@ioc:Adonis/Core/Helpers': {
    '*': {
      newPath: '@adonisjs/core/helpers',
    },
  },
  '@ioc:Adonis/Core/Event': {
    'default': {
      newName: 'emitter',
      newPath: '@adonisjs/core/services/emitter',
    },
    '*': {
      newPath: '@adonisjs/core/events',
    },
  },
  '@ioc:Adonis/Core/Logger': {
    'default': {
      newName: 'logger',
      newPath: '@adonisjs/core/services/logger',
    },
    '*': {
      newPath: '@adonisjs/core/logger',
    },
  },
  '@ioc:Adonis/Core/Application': {
    'default': {
      newName: 'app',
      newPath: '@adonisjs/core/services/app',
    },
    '*': {
      newPath: '@adonisjs/core/application',
    },
    'ApplicationContract': {
      newName: 'ApplicationService',
      newPath: '@adonisjs/core/types',
    },
  },
  '@ioc:Adonis/Core/HttpExceptionHandler': {
    '*': {
      newPath: '@adonisjs/core/http',
    },
  },
  '@ioc:Adonis/Core/HttpContext': {
    '*': {
      newPath: '@adonisjs/core/http',
    },
    'HttpContextContract': {
      newName: 'HttpContext',
    },
  },
  '@ioc:Adonis/Core/Env': {
    'default': {
      newName: 'env',
      newPath: '#start/env',
    },
    '*': {
      newPath: '@adonisjs/core/env',
    },
  },
  '@ioc:Adonis/Core/Hash': {
    'default': {
      newName: 'hash',
      newPath: '@adonisjs/core/services/hash',
    },
    '*': {
      newPath: '@adonisjs/core/hash',
    },
  },
  '@ioc:Adonis/Core/Validator': {
    '*': {
      newPath: '@adonisjs/validator',
    },
  },
  '@ioc:Adonis/Core/Server': {
    'default': {
      newName: 'server',
      newPath: '@adonisjs/core/services/server',
    },
    '*': {
      newPath: '@adonisjs/core/services/server',
    },
  },
  '@ioc:Adonis/Core/Route': {
    'default': {
      newName: 'router',
      newPath: '@adonisjs/core/services/router',
    },
    '*': {
      newPath: '@adonisjs/core/router',
    },
  },
  '@ioc:Adonis/Core/BodyParser': {
    '*': {
      newPath: '@adonisjs/bodyparser',
    },
  },

  '@ioc:Adonis/Addons/Session': {
    '*': {
      newPath: '@adonisjs/session',
    },
  },

  /**
   * ------------------------------------------------------
   * View
   * ------------------------------------------------------
   */
  '@ioc:Adonis/Core/View': {
    '*': {
      newPath: 'edge.js',
    },
  },

  /**
   * ------------------------------------------------------
   * Mail
   * ------------------------------------------------------
   */
  '@ioc:Adonis/Addons/Mail': {
    'default': {
      newName: 'mail',
      newPath: '@adonisjs/mail/services/main',
    },
    '*': {
      newPath: '@adonisjs/mail',
    },
  },

  /**
   * ------------------------------------------------------
   * Lucid
   * ------------------------------------------------------
   */
  '@ioc:Adonis/Lucid/Seeder': {
    '*': {
      newPath: '@adonisjs/lucid/seeders',
    },
  },
  '@ioc:Adonis/Lucid/Factory': {
    default: {
      newName: 'Factory',
      newPath: '@adonisjs/lucid/factories',
    },
  },
  '@ioc:Adonis/Lucid/Schema': {
    default: {
      newName: 'BaseSchema',
      newPath: '@adonisjs/lucid/schema',
    },
  },
  '@ioc:Adonis/Lucid/Database': {
    default: {
      newName: 'db',
      newPath: '@adonisjs/lucid/services/db',
    },
  },
  '@ioc:Adonis/Lucid/Orm': {
    '*': {
      newPath: '@adonisjs/lucid/orm',
    },

    /**
     * Relation types
     */
    'HasMany': { newPath: '@adonisjs/lucid/types/relations' },
    'BelongsTo': { newPath: '@adonisjs/lucid/types/relations' },
    'ExtractModelRelations': { newPath: '@adonisjs/lucid/types/relations' },
    'GetRelationModelInstance': { newPath: '@adonisjs/lucid/types/relations' },
    'RelationOptions': { newPath: '@adonisjs/lucid/types/relations' },
    'ManyToManyRelationOptions': { newPath: '@adonisjs/lucid/types/relations' },
    'ThroughRelationOptions': { newPath: '@adonisjs/lucid/types/relations' },
    'HasOneDecorator': { newPath: '@adonisjs/lucid/types/relations' },
    'HasManyDecorator': { newPath: '@adonisjs/lucid/types/relations' },
    'BelongsToDecorator': { newPath: '@adonisjs/lucid/types/relations' },
    'ManyToManyDecorator': { newPath: '@adonisjs/lucid/types/relations' },
    'HasManyThroughDecorator': { newPath: '@adonisjs/lucid/types/relations' },
    'ModelRelationTypes': { newPath: '@adonisjs/lucid/types/relations' },
    'HasOne': { newPath: '@adonisjs/lucid/types/relations' },
    'ManyToMany': { newPath: '@adonisjs/lucid/types/relations' },
    'HasManyThrough': { newPath: '@adonisjs/lucid/types/relations' },
    'ModelRelations': { newPath: '@adonisjs/lucid/types/relations' },
    'RelationshipsContract': { newPath: '@adonisjs/lucid/types/relations' },
    'UnSupportedSubQueryMethods': { newPath: '@adonisjs/lucid/types/relations' },

    /**
     * Model types
     */
    'DecoratorFn': { newPath: '@adonisjs/lucid/types/model' },
    'TypedDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'OptionalTypedDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'ModelAttributes': { newPath: '@adonisjs/lucid/types/model' },
    'ExtractScopes': { newPath: '@adonisjs/lucid/types/model' },
    'CacheNode': { newPath: '@adonisjs/lucid/types/model' },
    'CherryPickFields': { newPath: '@adonisjs/lucid/types/model' },
    'CherryPick': { newPath: '@adonisjs/lucid/types/model' },
    'EventsList': { newPath: '@adonisjs/lucid/types/model' },
    'HooksHandler': { newPath: '@adonisjs/lucid/types/model' },
    'QueryScopeCallback': { newPath: '@adonisjs/lucid/types/model' },
    'QueryScope': { newPath: '@adonisjs/lucid/types/model' },
    'ScopeFn': { newPath: '@adonisjs/lucid/types/model' },
    'ColumnOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ModelColumnOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ComputedOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ModelRelationOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ColumnDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'ComputedDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'DateColumnDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'DateTimeColumnDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'HooksDecorator': { newPath: '@adonisjs/lucid/types/model' },
    'ModelOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ModelAdapterOptions': { newPath: '@adonisjs/lucid/types/model' },
    'ModelAssignOptions': { newPath: '@adonisjs/lucid/types/model' },

    /**
     * Querybuilder types
     */
    'Dictionary': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'OneOrMany': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'ValueWithSubQueries': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'RawQuery': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'StrictValues': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'StrictValuesWithoutRaw': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'RawQueryBindings': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'QueryCallback': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'DBQueryCallback': { newPath: '@adonisjs/lucid/types/querybuilder' },
    'SimplePaginatorMetaKeys': { newPath: '@adonisjs/lucid/types/querybuilder' },
  },
}

/**
 * Mapping of old commands paths to new ones used by the
 * MigrateRcFile patcher
 */
export const commandsRewriteMapping = {
  '@adonisjs/core/build/commands': '@adonisjs/core/commands',
  '@adonisjs/lucid/build/commands': '@adonisjs/lucid/commands',
  '@adonisjs/mail/build/commands': '@adonisjs/mail/commands',
  '@adonisjs/view/build/commands': '@adonisjs/view/commands',
} as Record<string, string>

/**
 * Mapping of old providers paths to new ones used by the
 * MigrateRcFile patcher
 */
export const providersRewriteMapping = {
  '@adonisjs/core': [
    '@adonisjs/core/providers/app_provider',
    '@adonisjs/core/providers/http_provider',
    '@adonisjs/core/providers/hash_provider',
    {
      file: '@adonisjs/core/providers/repl_provider',
      environment: ['repl', 'test'],
    },
  ],
  '@adonisjs/session': ['@adonisjs/session/session_provider'],
  '@adonisjs/view': ['@adonisjs/view/views_provider'],
  '@adonisjs/shield': ['@adonisjs/shield/shield_provider'],
  '@adonisjs/redis': ['@adonisjs/redis/redis_provider'],
  '@adonisjs/mail': ['@adonisjs/mail/mail_provider'],
  '@adonisjs/ally': ['@adonisjs/ally/ally_provider'],
  '@adonisjs/lucid': ['@adonisjs/lucid/database_provider'],
  '@adonisjs/auth': ['@adonisjs/auth/auth_provider'],
} as Record<string, (string | { file: string; environment: string[] })[]>
