import { rm, writeFile } from 'node:fs/promises'
import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'
import { join } from 'node:path'

export function updateAce(): PatcherFactory {
  return (runner) => new UpdateAce(runner)
}

const aceContent = `/*
|--------------------------------------------------------------------------
| JavaScript entrypoint for running ace commands
|--------------------------------------------------------------------------
|
| Since, we cannot run TypeScript source code using "node" binary, we need
| a JavaScript entrypoint to run ace commands.
|
| This file runs "bin/console.ts" file as a child process and uses "ts-node/esm"
| loader to run TypeScript code.
|
| Executing this file is same as running the following command.
| "node --loader=ts-node/esm bin/console.js"
|
*/

import { aceShell } from '@adonisjs/core/ace/shell'

await aceShell(new URL('./', import.meta.url)).handle(process.argv.splice(2))
`

/**
 * Update the ace file
 * Also delete the olds commands/index.ts file
 */
export class UpdateAce extends BasePatcher {
  static patcherName = 'update-ace'

  async invoke(): Promise<void> {
    super.invoke()

    const rootDir = this.runner.project.getRootDirectories()[0].getPath()

    /**
     * Remove old files
     */
    await rm(join(rootDir, 'ace'))
    await rm(join(rootDir, 'commands', 'index.ts'))

    /**
     * Insert new one
     */
    const acePath = join(rootDir, 'ace.js')
    await writeFile(acePath, aceContent)

    this.logger.info('Updated ace file')

    this.exit()
  }
}
