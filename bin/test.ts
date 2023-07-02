import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { processCLIArgs, configure, run } from '@japa/runner'
import { BASE_URL } from '../test_helpers/index.js'
import { snapshot } from '@japa/snapshot'

processCLIArgs(process.argv.slice(2))
configure({
  files: ['tests/**/*.spec.ts'],
  timeout: 5000,
  plugins: [
    assert(),
    snapshot(),
    fileSystem({
      basePath: BASE_URL,
      autoClean: false,
    }),
  ],
})

run()
