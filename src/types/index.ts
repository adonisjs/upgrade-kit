import { cliui } from '@poppinss/cliui'
import { Runner } from '../runner.js'

/**
 * Common options accepted either by the runner or patchers
 */
export interface CommonOptions {
  dryRun?: boolean
  verbose?: boolean
}

/**
 * Options accepted by the runner
 */
export type RunnerOptions = {
  projectPath: string
  patchers: PatcherFactory[]
} & CommonOptions

/**
 * The contract that every patcher must adhere to
 */
export interface PatcherContract {
  invoke(): Promise<void> | void
}

/**
 * A factory function that returns a patcher instance
 */
export type PatcherFactory = (runner: Runner) => PatcherContract

/**
 * A map of old import paths to new import paths
 */
export type ImportMap = Record<
  string,
  Record<string, { newPath?: string; newName?: string; isNowNamedImport?: boolean }>
>

/**
 * Options for the rewriteIocImports patcher
 */
export type RewriteIocImportsOptions = {
  importMap?: ImportMap
} & CommonOptions

export type CliUi = ReturnType<typeof cliui>
