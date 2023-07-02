import { ImportMap } from '../../types/index.js'

/**
 * This is the default import mapping that will be used if
 * no custom mapping is provided.
 */
export const newImportsMapping = {
  '@adonisjs/core/build/standalone': {
    BaseCommand: {
      newPath: '@adonisjs/core/types/ace',
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
    '*': {
      newPath: '#start/env',
    },
  },
  '@ioc:Adonis/Core/Hash': {
    '*': {
      newPath: '@adonisjs/core/services/hash',
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
    '*': {
      newPath: '@adonisjs/core/services/route',
    },
  },
} as ImportMap
