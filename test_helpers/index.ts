import { FileSystem } from '@japa/file-system'
import { defu } from 'defu'
import { Runner } from '../src/runner.js'
import { RunnerOptions } from '../src/types/index.js'
import { cliui } from '@poppinss/cliui'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export function createRunner(options: RunnerOptions) {
  return new Runner({ ...options }, cliui({ mode: 'raw' }))
}

/**
 * Extend japa/file-system with custom methods
 */
declare module '@japa/file-system' {
  interface FileSystem {
    addTsConfig(data?: Record<string, any>): Promise<void>
    addRcFile(data?: Record<string, any>): Promise<void>
    addPackageJsonFile(data?: Record<string, any>): Promise<void>

    setupProject(options: {
      tsconfig?: Record<string, any>
      pkgJson?: Record<string, any>
      rcFile?: Record<string, any>
    }): Promise<void>
  }
}

FileSystem.macro('addTsConfig', function (this: FileSystem, data: Record<string, any> = {}) {
  const defaultConfig = { compilerOptions: { target: 'ESNext', module: 'NodeNext' } }
  return this.createJson('tsconfig.json', defu(data, defaultConfig))
})

FileSystem.macro('addRcFile', function (this: FileSystem, data: Record<string, any> = {}) {
  return this.createJson('.adonisrc.json', data)
})

FileSystem.macro('addPackageJsonFile', function (this: FileSystem, data: Record<string, any> = {}) {
  return this.createJson('package.json', data)
})

FileSystem.macro(
  'setupProject',
  async function (
    this: FileSystem,
    options: {
      tsconfig?: Record<string, any>
      pkgJson?: Record<string, any>
      rcFile?: Record<string, any>
    }
  ) {
    await Promise.all([
      await this.addTsConfig(options.tsconfig),
      await this.addRcFile(options.rcFile),
      await this.addPackageJsonFile(options.pkgJson),
    ])
  }
)
