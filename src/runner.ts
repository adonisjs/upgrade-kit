import { existsSync } from 'node:fs'
import { CliUi, PatcherContract, RunnerOptions } from './types/index.js'
import { Project } from 'ts-morph'
import { join } from 'node:path'
import { RcFile } from './files/rc_file.js'
import { cliui } from '@poppinss/cliui'
import { Tsconfig } from './files/ts_config.js'
import { PkgJson } from './files/pkg_json.js'

export class Runner {
  #patchers: PatcherContract[] = []

  #options: RunnerOptions

  project: Project
  ui: CliUi

  rcFile: RcFile
  tsConfigFile: Tsconfig
  pkgJsonFile: PkgJson

  constructor(options: Partial<RunnerOptions>, ui: CliUi = cliui()) {
    this.ui = ui
    this.#options = {
      projectPath: options.projectPath ?? process.cwd(),
      dryRun: options.dryRun ?? false,
      verbose: options.verbose ?? false,
      patchers: options.patchers ?? [],
    }

    this.#ensureHasConfigFiles()
    const loader = this.ui.logger
      .await(`Loading project from ${this.ui.colors.magenta(this.#options.projectPath)}`)
      .start()

    loader.update('Loading typescript files')
    this.project = new Project({
      tsConfigFilePath: join(this.#options.projectPath, 'tsconfig.json'),
    })

    loader.update('Loading config files')
    this.#patchers = this.#options.patchers.map((factory) => factory(this))
    this.rcFile = new RcFile(join(this.#options.projectPath, '.adonisrc.json'))
    this.tsConfigFile = new Tsconfig(join(this.#options.projectPath, 'tsconfig.json'))
    this.pkgJsonFile = new PkgJson(join(this.#options.projectPath, 'package.json'))

    loader.update('Project loaded. Running patchers now').stop()
  }

  /**
   * Check if needed config files exists
   */
  #ensureHasConfigFiles() {
    if (!existsSync(join(this.#options.projectPath, 'tsconfig.json'))) {
      throw new Error('tsconfig.json not found')
    }

    if (!existsSync(join(this.#options.projectPath, '.adonisrc.json'))) {
      throw new Error('.adonisrc.json not found')
    }

    if (!existsSync(join(this.#options.projectPath, 'package.json'))) {
      throw new Error('package.json not found')
    }

    return true
  }

  /**
   * Run all the patchers
   */
  async run() {
    this.ui.logger.log('')

    for (let patcher of this.#patchers) {
      try {
        await patcher.invoke()
      } catch (error) {
        this.ui.logger.fatal(`Error while running patcher : ${error.message}`)
        this.ui.logger.log('')
      }
    }

    await this.project.save()
  }
}
