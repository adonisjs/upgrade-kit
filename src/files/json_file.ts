import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

export class JsonFile {
  protected content: Record<string, any> = {}

  constructor(public filePath: string) {
    this.content = JSON.parse(readFileSync(filePath, 'utf-8'))
  }

  reload() {
    this.content = JSON.parse(readFileSync(this.filePath, 'utf-8'))
    return this
  }

  get() {
    return this.content
  }

  save() {
    return writeFile(this.filePath, JSON.stringify(this.content, null, 2))
  }
}
