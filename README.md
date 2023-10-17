# Adonis.js upgrade kit
> CLI tool to upgrade Adonis.js v5 projects to v6

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

![](./assets/upgrade-kit.png)

`adonis-upgrade-kit` is a CLI tool to upgrade Adonis.js v5 projects to v6. It probably won't cover all the work and you'll still have some manual actions to do, but at least a lot of the boring work will be done by this tool.

Type `adonis-upgrade-kit` to see all the available commands. Also check the [Adonis.js v6 upgrade guide](https://github.com/adonisjs/v5_to_v6_upgrade_guide/tree/main) for more informations about the different commands and the manual actions to do.

## Installation

```bash
npm i -g @adonisjs/upgrade-kit
adonis-upgrade-kit upgrade-packages --path ../path/to/your/project 
```

## Flags

| Flag | Description |
|---|---|
| `-p, --path` | Path to the project to upgrade. Defaults to the current directory. |

## Order of commands

The commands should ideally be run in the following order:

```sh
# Upgrade the packages
1. adonis-upgrade-kit upgrade-packages

# Move to ESM by updating tsconfig.json and package.json
2. adonis-upgrade-kit upgrade-module-system

# Upgrade Eslint and prettier setup
3. adonis-upgrade-kit upgrade-eslint-prettier

# Move the the new Env API
7. adonis-upgrade-kit upgrade-env-config

# Move from the old aliases to Node.js subpaths imports
4. adonis-upgrade-kit upgrade-aliases

# Move from the old IoC container to the new one
5. adonis-upgrade-kit migrate-ioc-imports

# Fix relative imports and add .js extensions ( needed for ESM )
6. adonis-upgrade-kit fix-relative-imports

# Add new entrypoints needed for Adonis.js v6
8. adonis-upgrade-kit upgrade-entrypoints

# Update config/*.ts files to use their new APIs
9. adonis-upgrade-kit upgrade-config-files

# Move from .adonisrc.json to adonisrc.ts
10. adonis-upgrade-kit upgrade-rcfile
```

[github-actions-image]: https://img.shields.io/github/actions/workflow/status/adonisjs/upgrade-kit/test.yml?style=for-the-badge "github-actions"

[github-actions-url]: https://github.com/adonisjs/upgrade-kit/actions/workflows/test.yml

[npm-image]: https://img.shields.io/npm/v/@adonisjs/upgrade-kit.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@adonisjs/upgrade-kit "npm"

[license-image]: https://img.shields.io/npm/l/@adonisjs/upgrade-kit?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
