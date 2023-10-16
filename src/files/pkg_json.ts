import { JsonFile } from './json_file.js'

export class PkgJson extends JsonFile {
  getSubpathImports() {
    return (this.content['imports'] || {}) as Record<string, string>
  }

  getInstalledPackages() {
    const dependencies = Object.keys(this.content['dependencies'] || {})
    const devDependencies = Object.keys(this.content['devDependencies'] || {})

    return [...new Set([...dependencies, ...devDependencies])]
  }

  addSubpathImports(imports: Record<string, string>) {
    this.content['imports'] = Object.assign(this.getSubpathImports(), imports)
  }

  set(key: string, value: any) {
    this.content[key] = value
  }
}
