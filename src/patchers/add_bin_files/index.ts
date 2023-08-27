import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

import { BasePatcher } from '../base_patcher.js'
import { testTemplate } from './test_template.js'
import { serverTemplate } from './server_template.js'
import { PatcherFactory } from '../../types/index.js'
import { consoleTemplate } from './console_template.js'
import { existsSync } from 'node:fs'

export function addBinFiles(): PatcherFactory {
  return (runner) => new AddBinFiles(runner)
}

/**
 * Add the 3 new bin files to the project
 * - bin/console.ts
 * - bin/test.ts
 * - bin/server.ts
 */
export class AddBinFiles extends BasePatcher {
  static patcherName = 'add-bin-files'

  async invoke() {
    super.invoke()

    const rootDir = this.runner.project.getRootDirectories()[0].getPath()

    if (!existsSync(join(rootDir, 'bin'))) {
      await mkdir(join(rootDir, 'bin'))
    }

    await Promise.all([
      writeFile(join(rootDir, 'bin', 'console.ts'), consoleTemplate),
      writeFile(join(rootDir, 'bin', 'test.ts'), testTemplate),
      writeFile(join(rootDir, 'bin', 'server.ts'), serverTemplate),
    ])

    this.exit()
  }
}
