import { join } from 'node:path'
import { detectPackageManager, installPackage } from '@antfu/install-pkg'

import { Runner } from '../../runner.js'
import { rmIfExists } from '../../utils.js'
import { BasePatcher } from '../base_patcher.js'
import { PatcherFactory } from '../../types/index.js'

export function upgradeEslintPrettier(packageManager?: string): PatcherFactory {
  return (runner) => new UpgradeEslintPrettier(runner, packageManager)
}

export class UpgradeEslintPrettier extends BasePatcher {
  static patcherName = 'upgrade-eslint-prettier'

  #pkgManager?: string

  constructor(runner: Runner, packageManager?: string) {
    super(runner)

    this.#pkgManager = packageManager
  }

  async invoke() {
    super.invoke()

    const rootDir = this.runner.project.getRootDirectories()[0].getPath()

    /**
     * Remove old eslint/prettier files
     */
    await rmIfExists(join(rootDir, '.eslintrc.json'))
    await rmIfExists(join(rootDir, '.eslintignore'))
    await rmIfExists(join(rootDir, '.prettierrc'))

    if (!this.#pkgManager) this.#pkgManager = (await detectPackageManager(rootDir)) ?? 'pnpm'

    /**
     * Remove old eslint/prettier packages
     */
    let pkgJson = this.runner.pkgJsonFile.reload().get()
    delete pkgJson.devDependencies?.['eslint-config-prettier']
    delete pkgJson.devDependencies?.['eslint-plugin-adonis']
    delete pkgJson.devDependencies?.['eslint-plugin-prettier']

    await this.runner.pkgJsonFile.save()

    /**
     * Install new eslint/prettier packages
     */
    await installPackage(
      ['@adonisjs/eslint-config', '@adonisjs/prettier-config', 'eslint@latest', 'prettier@latest'],
      {
        packageManager: this.#pkgManager,
        additionalArgs: ['--force'],
        dev: true,
        cwd: rootDir,
        silent: false,
      }
    )

    /**
     * Add new configuration for eslint/prettier
     */
    pkgJson = this.runner.pkgJsonFile.reload().get()

    pkgJson.eslintConfig = {
      extends: ['@adonisjs/eslint-config/app'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': 'off',
        'unicorn/filename-case': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
    }

    pkgJson.prettier = '@adonisjs/prettier-config'

    await this.runner.pkgJsonFile.save()

    this.exit()
  }
}
