import { ImportMap } from './types/index.js'

/**
 * Map of old import paths to new import paths
 * used by the RewriteIocImports patcher
 */
export const newImportsMapping: ImportMap = {
  '@adonisjs/core/build/standalone': {
    'BaseCommand': {
      newName: 'BaseCommand',
      newPath: '@adonisjs/core/ace',
    },
    '*': {
      newPath: '@adonisjs/core',
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
    '*': {
      newPath: '@adonisjs/core/application',
    },
    'ApplicationContract': {
      newName: 'ApplicationService',
      newPath: '@adonisjs/core/types',
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
      newPath: '@adonisjs/core/legacy/validator',
    },
  },
  '@ioc:Adonis/Core/Server': {
    '*': {
      newPath: '@adonisjs/core/services/server',
    },
  },
  '@ioc:Adonis/Core/Route': {
    'default': {
      newName: 'router',
      newPath: '@adonisjs/core/services/route',
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
  '@adonisjs/lucid': ['@adonisjs/lucid/lucid_provider'],
  '@adonisjs/auth': ['@adonisjs/auth/auth_provider'],
} as Record<string, (string | { file: string; environment: string[] })[]>
