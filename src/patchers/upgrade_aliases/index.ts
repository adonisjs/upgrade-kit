import { PatcherFactory } from '../../types/index.js'
import { lowercaseFirstLetter } from '../../utils.js'
import { BasePatcher } from '../base_patcher.js'

export function upgradeAliases(): PatcherFactory {
  return (runner) => new UpgradeAliases(runner)
}

/**
 * The default ts paths provided with Adonis v6
 */
const DEFAULT_TS_PATHS = {
  '#controllers/*': ['./app/controllers/*'],
  '#exceptions/*': ['./app/exceptions/*'],
  '#models/*': ['./app/models/*'],
  '#services/*': ['./app/services/*'],
  '#listeners/*': ['./app/listeners/*'],
  '#events/*': ['./app/events/*'],
  '#middleware/*': ['./app/middleware/*'],
  '#validators/*': ['./app/validators/*'],
  '#start/*': ['./start/*'],
  '#config/*': ['./config/*'],
}

/**
 * Default subpaths import provided with Adonis v6
 */
const DEFAULT_SUBPATHS = {
  '#controllers/*': './app/controllers/*.js',
  '#exceptions/*': './app/exceptions/*.js',
  '#models/*': './app/models/*.js',
  '#services/*': './app/services/*.js',
  '#listeners/*': './app/listeners/*.js',
  '#events/*': './app/events/*.js',
  '#middleware/*': './app/middleware/*.js',
  '#validators/*': './app/validators/*.js',
  '#start/*': './start/*.js',
  '#config/*': './config/*.js',
}

/**
 * With Adonis 5, we used to define aliases inside `.adonisrc.json` file.
 * Now, with Adonis 6, we have moved to Node.js native subpath imports.
 *
 * So here we do the following:
 * 1. Convert aliases to subpath imports and save them to package.json
 * 2. Convert alias to ts paths and save them to tsconfig.json
 * 3. Remove aliases from .adonisrc.json file
 * 4. Update the imports inside the source files
 */
export class UpgradeAliases extends BasePatcher {
  static patcherName = 'upgrade-aliases'

  /**
   * Converts aliases to ts paths entries
   */
  #convertAliasesToTsPaths() {
    const aliases = this.runner.rcFile.getAliases()

    return Object.entries(aliases).reduce(
      (acc, [alias, path]) => {
        const tsPathKey = `#${alias.toLowerCase()}/*`
        const tsPathValue = ['./' + path + '/*']

        acc[tsPathKey] = tsPathValue
        return acc
      },
      {} as Record<string, string[]>
    )
  }

  /**
   * Converts aliases to subpaths entries
   */
  #convertAliasesToSubpaths() {
    const tsPaths = this.#convertAliasesToTsPaths()

    return Object.entries(tsPaths).reduce(
      (acc, [tsPathKey, tsPathValue]) => {
        const subpathKey = tsPathKey
        const subpathValue = `${tsPathValue}.js`

        acc[subpathKey] = subpathValue

        return acc
      },
      {} as Record<string, string>
    )
  }

  /**
   * Update the different config files with new paths
   */
  async #updateConfigsWithNewPaths() {
    const newSubpaths = this.#convertAliasesToSubpaths()
    const newTsPaths = this.#convertAliasesToTsPaths()

    this.runner.tsConfigFile.addPaths({
      ...DEFAULT_TS_PATHS,
      ...newTsPaths,
    })

    this.runner.pkgJsonFile.addSubpathImports({
      ...DEFAULT_SUBPATHS,
      ...newSubpaths,
    })

    this.runner.rcFile.removeAliases()

    await this.runner.tsConfigFile.save()
    this.logger.info('Updated tsconfig.json `compilerOptions.paths` with new ones')

    await this.runner.pkgJsonFile.save()
    this.logger.info('Updated package.json `imports` with new ones')

    await this.runner.rcFile.save()
    this.logger.info('Removed aliases from .adonisrc.json')
  }

  /**
   * Check if the given module specifier is using an old alias import
   */
  #isOldAliasImport(specifier: string) {
    const oldAliases = this.runner.rcFile.getAliases()

    return Object.values(oldAliases).some((path) =>
      specifier.toLowerCase().startsWith((path as string).toLowerCase())
    )
  }

  async invoke(): Promise<void> {
    super.invoke()

    const tsFiles = this.project.getSourceFiles()

    for (let file of tsFiles) {
      const imports = file.getImportDeclarations()

      for (let importNode of imports) {
        const specifier = importNode.getModuleSpecifierValue()
        const isOldAliasImport = this.#isOldAliasImport(specifier)

        if (!isOldAliasImport) {
          continue
        }

        const newSpecifier = `#${lowercaseFirstLetter(specifier)}`
        importNode.setModuleSpecifier(newSpecifier)
      }
    }

    await this.#updateConfigsWithNewPaths()
    this.exit()
  }
}
