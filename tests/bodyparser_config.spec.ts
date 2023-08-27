import { test } from '@japa/runner'
import dedent from 'dedent'

import { createRunner } from '../test_helpers/index.js'
import { bodyparserConfig } from '../src/patchers/bodyparser_config/index.js'

test.group('Bodyparser config', () => {
  test('Update bodyparser config', async ({ assert, fs }) => {
    await fs.addTsConfig()

    await fs.create(
      'config/bodyparser.ts',
      dedent`
      import { BodyParserConfig } from '@ioc:Adonis/Core/BodyParser'

      const bodyParserConfig: BodyParserConfig = {
        whitelistedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

        json: {
          encoding: 'utf-8',
          limit: '1mb',
          strict: true,
          types: [
            'application/json',
            'application/json-patch+json',
            'application/vnd.api+json',
            'application/csp-report',
          ],
        },


        form: {
          encoding: 'utf-8',
          limit: '1mb',
          queryString: {},
          convertEmptyStringsToNull: true,

          types: ['application/x-www-form-urlencoded'],
        },
        raw: {
          encoding: 'utf-8',
          limit: '1mb',
          queryString: {},
          types: ['text/*'],
        },
        multipart: {
          autoProcess: true,
          processManually: [],
          encoding: 'utf-8',
          convertEmptyStringsToNull: true,
          maxFields: 1000,
          limit: '20mb',
          types: ['multipart/form-data'],
        },
      }
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [bodyparserConfig()],
    }).run()

    const content = await fs.contents('config/bodyparser.ts')

    assert.snapshot(content).match()
  })
})
