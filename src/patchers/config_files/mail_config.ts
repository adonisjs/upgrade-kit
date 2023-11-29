import dedent from 'dedent'
import { PatcherFactory } from '../../types/index.js'
import { ConfigUpdaterPatcher } from '../config_updater_patcher.js'
import { join } from 'node:path'

export function mailConfig(): PatcherFactory {
  return (runner) => new MailConfig(runner)
}

/**
 * Rewrite the config/mail.ts file to use the new API
 */
export class MailConfig extends ConfigUpdaterPatcher {
  static patcherName = 'mail-config'

  async invoke() {
    super.invoke()

    const file = this.getConfigFile('config/mail.ts')
    if (!file) return

    /**
     * Rename import from @adonisjs/mail/build/config to @adonisjs/mail
     */
    const oldImport = file.getImportDeclaration('@adonisjs/mail/build/config')
    console.log(oldImport?.getKindName())
    if (oldImport) {
      const namedImports = oldImport?.getNamedImports()

      const mailConfigImport = namedImports?.find((namedImport) => {
        return namedImport.getName() === 'mailConfig'
      })

      if (mailConfigImport) {
        mailConfigImport.setName('defineConfig').setAlias('mailConfig').removeAliasWithRename()
      }

      oldImport.setModuleSpecifier('@adonisjs/mail')
    }

    /**
     * Move to config providers
     */
    this.moveToConfigProvider({
      file,
      driversImport: { module: '@adonisjs/mail', named: 'transports' },
      driversToTransform: ['mailgun', 'smtp', 'ses', 'sparkpost', 'resend'],
      inList: 'mailers',
    })

    /**
     * Also add the types augmentation
     */
    const typesAugmentation = dedent`
      declare module '@adonisjs/mail/types' {
        export interface MailersList extends InferMailers<typeof mailConfig> {}
      }
    `
    file.insertText(file.getEnd(), '\n\n' + typesAugmentation)

    /**
     * And remove the old one
     */
    const hashContractFile = join(
      this.runner.project.getRootDirectories()[0].getPath(),
      '/contracts/mail.ts'
    )
    await this.runner.project.getSourceFile(hashContractFile)?.deleteImmediately()

    await this.formatFile(file).save()
    this.logger.info('Updated config/mail.ts file')

    this.exit()
  }
}
