import { ImportMap } from '../../types/index.js'

/**
 * This is the default import mapping that will be used if
 * no custom mapping is provided.
 */
export const newImportsMapping = {
  '@adonisjs/core/build/standalone': {
    'BaseCommand': {
      newPath: '@adonisjs/core/types/ace',
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
} as ImportMap
