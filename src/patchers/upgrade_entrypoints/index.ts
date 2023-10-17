import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

import { BasePatcher } from '../base_patcher.js'
import { testTemplate } from './test_template.js'
import { serverTemplate } from './server_template.js'
import { PatcherFactory } from '../../types/index.js'
import { consoleTemplate } from './console_template.js'
import { existsSync } from 'node:fs'
import { aceTemplate } from './ace_template.js'
import { rmIfExists } from '../../utils.js'

export function upgradeEntrypoints(): PatcherFactory {
  return (runner) => new UpgradeEntrypoints(runner)
}

/**
 * Add the 3 new bin files to the project
 * - bin/console.ts
 * - bin/test.ts
 * - bin/server.ts
 *
 * And also the ace.js root file
 */
export class UpgradeEntrypoints extends BasePatcher {
  static patcherName = 'add-bin-files'

  async invoke() {
    super.invoke()

    const rootDir = this.runner.project.getRootDirectories()[0].getPath()

    if (!existsSync(join(rootDir, 'bin'))) {
      await mkdir(join(rootDir, 'bin'))
    }

    await Promise.all([
      /**
       * Bin Files
       */
      writeFile(join(rootDir, 'bin', 'console.ts'), consoleTemplate).then(() => {
        this.logger.info('Created bin/console.ts')
      }),
      writeFile(join(rootDir, 'bin', 'test.ts'), testTemplate).then(() => {
        this.logger.info('Created bin/test.ts')
      }),
      writeFile(join(rootDir, 'bin', 'server.ts'), serverTemplate).then(() => {
        this.logger.info('Created bin/server.ts')
      }),

      /**
       * Ace file and also remove the old commands/index file
       */
      rmIfExists(join(rootDir, 'ace')),
      rmIfExists(join(rootDir, 'commands', 'index.ts')),
      writeFile(join(rootDir, 'ace.js'), aceTemplate).then(() => {
        this.logger.info('Created ace.js')
      }),
    ])

    this.exit()
  }
}
