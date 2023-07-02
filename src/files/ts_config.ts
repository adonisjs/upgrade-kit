import { JsonFile } from './json_file.js'

export class Tsconfig extends JsonFile {
  addPaths(paths: Record<string, string[]>) {
    const currentPaths = this.content['compilerOptions']?.paths ?? {}
    this.content['compilerOptions'] = {
      ...this.content['compilerOptions'],
      paths: { ...currentPaths, ...paths },
    }
  }

  removePaths(keys: string[]) {
    const paths = this.content['compilerOptions']?.paths ?? {}
    for (const key of keys) {
      delete paths[key]
    }
  }
}
