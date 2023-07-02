import { JsonFile } from './json_file.js'

export class PkgJson extends JsonFile {
  getSubpathImports() {
    return (this.content['imports'] || {}) as Record<string, string>
  }

  addSubpathImports(imports: Record<string, string>) {
    this.content['imports'] = Object.assign(this.getSubpathImports(), imports)
  }

  set(key: string, value: any) {
    this.content[key] = value
  }
}
