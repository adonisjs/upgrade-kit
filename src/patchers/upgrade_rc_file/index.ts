import dedent from 'dedent'
import { join } from 'node:path'
import { readFile, rm } from 'node:fs/promises'
import { ObjectLiteralExpression, SyntaxKind } from 'ts-morph'

import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'
import { commandsRewriteMapping, providersRewriteMapping } from '../../rewrite_maps.js'

export function upgradeRcFile(): PatcherFactory {
  return (runner) => new UpgradeRcFile(runner)
}

/**
 * Migrate .adonisrc.json file to .adonisrc.ts
 *
 * Note that it will also modify some of the commands and providers
 * paths since some of them has been moved with v6.
 */
export class UpgradeRcFile extends BasePatcher {
  static patcherName = 'migrate-rc-file'
  #rootDir!: string
  #jsonRcFileContents!: Record<string, any>

  /**
   * Create the new adonisrc.ts file and returns the source
   * + defineConfig node
   */
  #initAdonisrcFile() {
    const rootDir = this.runner.project.getRootDirectories()[0].getPath()

    const source = this.project.createSourceFile(join(rootDir, 'adonisrc.ts'), '', {
      overwrite: true,
    })

    source.addImportDeclaration({
      moduleSpecifier: '@adonisjs/core/app',
      namedImports: ['defineConfig'],
    })

    const exportAssignment = source.addExportAssignment({
      isExportEquals: false,
      expression: `defineConfig({})`,
    })

    const defineConfig = exportAssignment
      .getExpression()!
      .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)[0]

    return { source, defineConfig }
  }

  /**
   * Load the old .adonisrc.json file
   */
  async #loadJsonRcFile() {
    const rcFile = await readFile(join(this.#rootDir, '.adonisrc.json'), 'utf-8')
    if (!rcFile) return

    this.#jsonRcFileContents = JSON.parse(rcFile)
  }

  /**
   * Migrate the `commands` property
   */
  #migrateCommands(defineConfig: ObjectLiteralExpression) {
    let commands: string[] = this.#jsonRcFileContents.commands ?? []

    /**
     * Remove the ./commands path and the repl commands
     * since they are not needed anymore.
     * Also rewrite the needed commands paths
     */
    commands = commands
      .filter((command) => command !== './commands')
      .filter((command) => command !== '@adonisjs/repl/build/commands')
      .map((command) => commandsRewriteMapping[command] ?? command)

    /**
     * Add the commands to the adonisrc.ts file
     */
    if (!commands.length) return
    defineConfig.addPropertyAssignment({
      name: 'commands',
      initializer: `[${commands.map((command) => `() => import('${command}')`).join(', ')}]`,
      leadingTrivia: dedent`
      /*
      |--------------------------------------------------------------------------
      | Commands
      |--------------------------------------------------------------------------
      |
      | List of ace commands to register from packages. The application commands
      | will be scanned automatically from the "./commands" directory.
      |
      */\n`,
    })
  }

  /**
   * Migration the `preloads` property
   */
  #migratePreloads(defineConfig: ObjectLiteralExpression) {
    type PreloadNode = { file: string; environment: 'console' | 'web' | 'test' | 'repl' } | string
    const oldPreloads: PreloadNode[] = this.#jsonRcFileContents.preloads ?? []

    const preloadsArray = oldPreloads.map((preload) => {
      if (typeof preload === 'string') {
        return `() => import('${preload}.js')`
      }

      return `{
        file: () => import('${preload.file}'),
        environment: ${JSON.stringify(preload.environment)},
      }`
    })

    if (!preloadsArray.length) return

    defineConfig.addPropertyAssignment({
      name: 'preloads',
      initializer: `[\n${preloadsArray.join(',\n')}\n]`,
      leadingTrivia: dedent`
      /*
      |--------------------------------------------------------------------------
      | Preloads
      |--------------------------------------------------------------------------
      |
      | List of modules to import before starting the application.
      |
      */\n
      `,
    })
  }

  #migrateProviders(defineConfig: ObjectLiteralExpression) {
    const oldProviders: Array<string | Record<string, any>> =
      this.#jsonRcFileContents.providers ?? []

    const newProviders = oldProviders.map((provider) => {
      if (typeof provider === 'string') {
        const isLocalProvider = provider.startsWith('./')
        if (isLocalProvider) provider += '.js'

        return `() => import('${provider}')`
      } else {
        const fileImport = `() => import('${provider.file}')`
        const { file, ...rest } = provider

        return `{ "file": ${fileImport}, ${JSON.stringify(rest).slice(1)}`
      }
    })

    if (!newProviders.length) return

    defineConfig.addPropertyAssignment({
      name: 'providers',
      initializer: `[\n${newProviders.join(',\n')}\n]`,
      leadingTrivia: dedent`
      /*
      |--------------------------------------------------------------------------
      | Service providers
      |--------------------------------------------------------------------------
      |
      | List of service providers to import and register when booting the
      | application
      |
      */\n
     `,
    })
  }

  /**
   * Migrate the `metaFiles` property
   */
  #migrateMetaFiles(defineConfig: ObjectLiteralExpression) {
    const oldMetaFiles = this.#jsonRcFileContents.metaFiles ?? {}

    if (!Object.keys(oldMetaFiles).length) return

    defineConfig.addPropertyAssignment({
      name: 'metaFiles',
      initializer: JSON.stringify(oldMetaFiles, null, 2),
    })
  }

  /**
   * Migrate the `directories` property
   */
  #migrateDirectories(defineConfig: ObjectLiteralExpression) {
    const oldDirectories: Record<string, string> = this.#jsonRcFileContents.directories ?? {}

    if (!Object.keys(oldDirectories).length) return

    defineConfig.addPropertyAssignment({
      name: 'directories',
      initializer: JSON.stringify(oldDirectories, null, 2),
    })
  }

  /**
   * Migrate the `tests` property
   */
  #migrateTestSuites(defineConfig: ObjectLiteralExpression) {
    const oldTestSuites: Record<string, string> = this.#jsonRcFileContents.tests ?? {}

    if (!Object.keys(oldTestSuites).length) return

    defineConfig.addPropertyAssignment({
      name: 'tests',
      initializer: JSON.stringify(oldTestSuites, null, 2),
      leadingTrivia: dedent`
      /*
      |--------------------------------------------------------------------------
      | Tests
      |--------------------------------------------------------------------------
      |
      | List of test suites to organize tests by their type. Feel free to remove
      | and add additional suites.
      |
      */\n
      `,
    })
  }

  async invoke(): Promise<void> {
    super.invoke()

    this.#rootDir = this.runner.project.getRootDirectories()[0].getPath()

    /**
     * Load old json rc file
     */
    await this.#loadJsonRcFile()
    if (!this.#jsonRcFileContents) {
      this.logger.warning('Cannot find .adonisrc.json file. Skipping the patcher')
      return this.exit()
    }

    /**
     * Create a new adonisrc.ts file
     */
    const { defineConfig, source } = this.#initAdonisrcFile()

    /**
     * Migrate every property
     */
    this.#migrateCommands(defineConfig)
    this.#migratePreloads(defineConfig)
    this.#migrateProviders(defineConfig)
    this.#migrateMetaFiles(defineConfig)
    this.#migrateDirectories(defineConfig)
    this.#migrateTestSuites(defineConfig)

    /**
     * Delete old .adonisrc.json file and save the new one
     */
    await rm(join(this.#rootDir, '.adonisrc.json'))
    await this.formatFile(source).save()

    this.exit()
  }
}
