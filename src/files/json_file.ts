import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

export class JsonFile {
  protected content: Record<string, any> = {}

  constructor(public filePath: string) {
    this.content = JSON.parse(readFileSync(filePath, 'utf-8'))
  }

  get() {
    return this.content
  }

  save() {
    return writeFile(this.filePath, JSON.stringify(this.content, null, 2))
  }
}
