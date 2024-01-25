import { BaseCommand } from '@adonisjs/ace'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

export class Version extends BaseCommand {
  static commandName = 'version'
  static description = 'Display the version number'

  async run() {
    const currentDirname = dirname(fileURLToPath(import.meta.url))
    const pkgJsonPossibleLocations = [
      join(currentDirname, '..', '..', 'package.json'),
      join(currentDirname, '..', '..', '..', 'package.json'),
    ]

    const pkgJsonLocation = pkgJsonPossibleLocations.find((location) => existsSync(location))

    const pkgJson = JSON.parse(await readFile(pkgJsonLocation!, 'utf-8'))
    this.ui.logger.log(pkgJson.version)
  }
}
