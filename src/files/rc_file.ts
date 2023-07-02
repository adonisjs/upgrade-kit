import { JsonFile } from './json_file.js'

export class RcFile extends JsonFile {
  getAliases() {
    return this.content.aliases ?? {}
  }

  removeAliases() {
    delete this.content.aliases
  }
}
