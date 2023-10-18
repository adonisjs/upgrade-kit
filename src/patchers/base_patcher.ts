import { Project, SourceFile } from 'ts-morph'
import { Runner } from '../runner.js'
import { PatcherContract, PatcherFactory } from '../types/index.js'
import { Colors } from '@poppinss/cliui/types'

export abstract class BasePatcher implements PatcherContract {
  declare static patcherName: string
  declare static register: PatcherFactory

  #startedAt = Date.now()
  protected project: Project
  protected runner: Runner

  constructor(runner: Runner) {
    this.runner = runner
    this.project = runner.project
  }

  get logger() {
    return this.runner.ui.logger
  }

  get colors(): Colors {
    return this.runner.ui.colors
  }

  invoke() {
    this.#startedAt = Date.now()
    // @ts-ignore
    this.logger.info(`Starting patcher ${this.colors.magenta(this.constructor['patcherName'])}`)
  }

  formatFile(file: SourceFile) {
    file.formatText({
      indentSize: 2,
      convertTabsToSpaces: true,
      trimTrailingWhitespace: true,
    })

    return file
  }

  exit() {
    this.logger.success(`Finished patching`, {
      suffix: this.colors.dim(`${Date.now() - this.#startedAt}ms`),
    })
    this.logger.log('')
  }
}
