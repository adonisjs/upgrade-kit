import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export async function rmIfExists(path: string) {
  if (existsSync(path)) {
    await rm(path)
  }
}
