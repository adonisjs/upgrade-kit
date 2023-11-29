import dedent from 'dedent'
import { test } from '@japa/runner'

import { createRunner } from '../test_helpers/index.js'
import { mailConfig } from '../src/patchers/config_files/mail_config.js'

test.group('Mail config', () => {
  test('Update mail config', async ({ assert, fs }) => {
    await fs.setupProject({})

    await fs.create(
      'config/mail.ts',
      dedent`
      import Env from '@ioc:Adonis/Core/Env'
      import { mailConfig } from '@adonisjs/mail/build/config'

      export default mailConfig({
        mailer: 'smtp',
        mailers: {
          smtp: {
            driver: 'smtp',
            host: Env.get('SMTP_HOST'),
            port: Env.get('SMTP_PORT'),
            auth: {
              user: Env.get('SMTP_USERNAME'),
              pass: Env.get('SMTP_PASSWORD'),
              type: 'login',
            }
          },
        },
      })
      `
    )

    await createRunner({
      projectPath: fs.basePath,
      patchers: [mailConfig()],
    }).run()

    const content = await fs.contents('config/mail.ts')

    assert.snapshot(content).matchInline(`
      "import Env from '@ioc:Adonis/Core/Env'
      import { defineConfig } from '@adonisjs/mail'
      import { transports } from \\"@adonisjs/mail\\";

      export default defineConfig({
        mailer: 'smtp',
        mailers: {
          smtp: drivers.smtp({
            host: Env.get('SMTP_HOST'),
            port: Env.get('SMTP_PORT'),
            auth: {
              user: Env.get('SMTP_USERNAME'),
              pass: Env.get('SMTP_PASSWORD'),
              type: 'login',
            }
          }),
        },
      })

      declare module '@adonisjs/mail/types' {
        export interface MailersList extends InferMailers<typeof mailConfig> { }
      }
      "
    `)
  })
})
