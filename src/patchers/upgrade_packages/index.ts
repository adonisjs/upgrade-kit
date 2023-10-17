import { join } from 'node:path'
import { Runner } from '../../runner.js'
import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'
import { detectPackageManager, installPackage } from '@antfu/install-pkg'
import { execa } from 'execa'
import { commandsRewriteMapping, providersRewriteMapping } from '../../rewrite_maps.js'

export function upgradePackages({
  packageManager,
  skipInstall,
}: { packageManager?: string; skipInstall?: boolean } = {}): PatcherFactory {
  return (runner) => new UpgradePackages(runner, packageManager, skipInstall)
}

/**
 * - Upgrade packages to V6, remove deprecated packages and add new ones
 * - Update RC file with new providers and commands paths
 */
export class UpgradePackages extends BasePatcher {
  static patcherName = 'upgrade-packages'

  #pkgManager?: string
  #rootDir!: string
  #skipInstall = false

  #packagesToRemove = ['@adonisjs/repl', 'source-map-support', 'youch', 'youch-terminal']
  #packagesToSwap = [
    { old: 'phc-argon2', name: 'argon2', isDev: false },
    { old: 'phc-bcrypt', name: 'bcrypt', isDev: false },
    { old: '@japa/preset-adonis', name: '@japa/plugin-adonisjs', isDev: true },
    { old: 'adonis-preset-ts', name: '@adonisjs/tsconfig', isDev: true },
  ]
  #packagesToAdd = [
    { name: 'ts-node', isDev: true },
    { name: '@swc/core', isDev: true },
    { name: '@adonisjs/validator', isDev: false },
  ]
  #packagesToUpgrade = [
    { name: '@adonisjs/assembler', isDev: true },
    { name: '@adonisjs/core', isDev: false },
    { name: '@adonisjs/lucid', isDev: false },
    { name: '@adonisjs/session', isDev: false },
    { name: '@adonisjs/shield', isDev: false },
    { name: '@adonisjs/view', isDev: false },
    { name: '@japa/browser-client', isDev: true },
    { name: '@japa/runner', isDev: true },
    { name: 'pino-pretty', isDev: true },
  ]

  constructor(runner: Runner, packageManager?: string, skipInstall?: boolean) {
    super(runner)

    this.#pkgManager = packageManager
    this.#skipInstall = skipInstall ?? false
  }

  #filterDevAndProdPackages(packages: Array<{ name: string; isDev: boolean }>) {
    const devPackages = packages.filter((pkg) => pkg.isDev).map((pkg) => pkg.name)
    const prodPackages = packages.filter((pkg) => !pkg.isDev).map((pkg) => pkg.name)

    return { devPackages, prodPackages }
  }

  async #installPackages(packages: string[], isDev: boolean) {
    await installPackage(packages, {
      dev: isDev,
      packageManager: this.#pkgManager,
      cwd: this.#rootDir,
    })
  }

  async #removePackages(packages: string[]) {
    await execa(this.#pkgManager!, ['remove', ...packages], { cwd: this.#rootDir })
  }

  async #replacePackages(entries: Array<{ old: string; name: string }>, isDev: boolean) {
    await this.#removePackages(entries.map((entry) => entry.old))
    await this.#installPackages(
      entries.map((entry) => entry.name),
      isDev
    )
  }

  /**
   * Upgrades packages to their v6 version. Only upgrade if the package is already
   * installed
   */
  async #upgradePackages() {
    const installedPackages = this.runner.pkgJsonFile.getInstalledPackages()
    const pkgToUpgrades = this.#packagesToUpgrade.filter((pkg) =>
      installedPackages.includes(pkg.name)
    )

    const pkgWithVersions = pkgToUpgrades.map((pkg) => {
      if (pkg.name.startsWith('@japa') || pkg.name.startsWith('@adonisjs')) {
        return { name: `${pkg.name}@next`, isDev: pkg.isDev }
      }

      return { name: `${pkg.name}@latest`, isDev: pkg.isDev }
    })

    const { devPackages: devPackagesNamesToUpgrade, prodPackages: prodPackagesNamesToUpgrade } =
      this.#filterDevAndProdPackages(pkgWithVersions)

    if (prodPackagesNamesToUpgrade.length) {
      await this.#installPackages(prodPackagesNamesToUpgrade, false)
    }

    if (devPackagesNamesToUpgrade.length) {
      await this.#installPackages(devPackagesNamesToUpgrade, true)
    }
  }

  /**
   * Removes packages that are not needed anymore with v6
   */
  async #removeDeprecatedPackages() {
    const packagesToRemove = this.runner.pkgJsonFile
      .getInstalledPackages()
      .filter((pkg) => this.#packagesToRemove.includes(pkg))

    if (!packagesToRemove.length) return
    await this.#removePackages(packagesToRemove)
  }

  /**
   * - Install new needed packages
   * - Also install @adonisjs/cors and @adonisjs/static if theses config files exists
   */
  async #addNewNeededPackages() {
    const project = this.runner.project
    const { devPackages, prodPackages } = this.#filterDevAndProdPackages(this.#packagesToAdd)

    const hasCorsConfig = project.getSourceFile(join(this.#rootDir, 'config/cors.ts'))
    if (hasCorsConfig) prodPackages.push('@adonisjs/cors')

    const hasStaticConfig = project.getSourceFile(join(this.#rootDir, 'config/static.ts'))
    if (hasStaticConfig) prodPackages.push('@adonisjs/static')

    await this.#installPackages(prodPackages, false)
    await this.#installPackages(devPackages, true)
  }

  /**
   * Replace deprecated packages with new ones that comes as
   * replacement for v6
   */
  async #replaceDeprecatedPackagesWithNewOnes() {
    const pkgToSwaps = this.runner.pkgJsonFile
      .getInstalledPackages()
      .filter((pkg) => this.#packagesToSwap.map((pkgToSwap) => pkgToSwap.old).includes(pkg))
      .map((pkg) => this.#packagesToSwap.find((pkgToSwap) => pkgToSwap.old === pkg)!)

    const prodPackages = pkgToSwaps.filter((pkg) => !pkg.isDev)
    const devPackages = pkgToSwaps.filter((pkg) => pkg.isDev)

    if (prodPackages.length) await this.#replacePackages(prodPackages, false)
    if (devPackages.length) await this.#replacePackages(devPackages, true)
  }

  /**
   * Rewrite Rc File providers path by using the providersRewriteMapping
   * we defined
   */
  #rewriteRcFileProviders(rcFile: Record<string, any>) {
    const providers = rcFile.providers ?? []

    const providersToRewrite = Object.keys(providersRewriteMapping).filter((provider) =>
      providers.includes(provider)
    )

    for (const provider of providersToRewrite) {
      const newProviders = providersRewriteMapping[provider]
      providers.splice(providers.indexOf(provider), 1, ...newProviders)
    }

    rcFile.providers = providers
  }

  /**
   * Rewrite Rc File commands path.
   * Also remove ./commands and repl commands since they are not needed anymore
   */
  #rewriteRcFileCommands(rcFile: Record<string, any>) {
    let commands: string[] = rcFile.commands ?? []

    commands = commands
      .filter((command) => command !== './commands')
      .filter((command) => command !== '@adonisjs/repl/build/commands')
      .map((command) => commandsRewriteMapping[command] ?? command)

    rcFile.commands = commands
  }

  /**
   * Update RC File with new providers and commands paths
   */
  async #updateRcFile() {
    const rcFile = this.runner.rcFile.get()
    if (!rcFile) return

    this.#rewriteRcFileProviders(rcFile)
    this.#rewriteRcFileCommands(rcFile)

    await this.runner.rcFile.save()
  }

  async invoke(): Promise<void> {
    super.invoke()

    this.#rootDir = this.runner.project.getRootDirectories()[0].getPath()
    if (!this.#pkgManager) this.#pkgManager = (await detectPackageManager(this.#rootDir)) ?? 'pnpm'

    if (!this.#skipInstall) {
      await this.#upgradePackages()
      await this.#removeDeprecatedPackages()
      await this.#addNewNeededPackages()
      await this.#replaceDeprecatedPackagesWithNewOnes()
    }

    await this.#updateRcFile()
  }
}
