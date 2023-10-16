import { BaseCommand as AceBaseCommand, flags } from '@adonisjs/ace'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { patchers } from '../patchers/index.js'
import { Runner } from '../runner.js'

export class BaseCommand extends AceBaseCommand {
  @flags.string({ name: 'path', description: 'path to project' })
  declare path: string

  protected projectPath!: string

  protected generatePatchersFromPrompt(selectedPatchers: string[]) {
    const patchersClasses = selectedPatchers.map((patcher) =>
      patchers.find((p) => p.patcherName === patcher)
    )

    return patchersClasses.map((patcher) => (r: Runner) => new patcher!(r))
  }

  protected displayHeading() {
    const title = Buffer.from(
      'CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICAgXyAgICBfIF8gICAKICBfICAgXyBfIF9fICAgX18gXyBfIF9fIF9fIF8gIF9ffCB8IF9fXyAgICAgIHwgfCBfKF8pIHxfIAogfCB8IHwgfCAnXyBcIC8gX2AgfCAnX18vIF9gIHwvIF9gIHwvIF8gXF9fX19ffCB8LyAvIHwgX198CiB8IHxffCB8IHxfKSB8IChffCB8IHwgfCAoX3wgfCAoX3wgfCAgX18vX19fX198ICAgPHwgfCB8XyAKICBcX18sX3wgLl9fLyBcX18sIHxffCAgXF9fLF98XF9fLF98XF9fX3wgICAgIHxffFxfXF98XF9ffAogICAgICAgfF98ICAgIHxfX18vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCg==',
      'base64'
    )
    this.logger.log(this.colors.magenta(title.toString('utf-8')))

    this.projectPath = this.path ? resolve(this.path) : cwd()
    this.ui
      .sticker()
      .add('Project path: ' + this.colors.magenta(this.projectPath))
      .add('')
      .add(this.colors.yellow('Before running this command, make sure to backup your codebase !'))
      .add(this.colors.yellow('Or setup a different git branch to test the changes.'))
      .add('')
      .add(
        this.colors.yellow('Also make sure to manually verify the changes before committing them')
      )
      .render()
  }

  protected displayFooter() {
    this.ui
      .sticker()
      .add(`${this.ui.colors.magenta(this.ui.icons.tick + ' All Done !')}`)
      .add('')
      .add(`Make sure to manually check the changes made to the files`)
      .add('Also run prettier/eslint to fix the formatting')
      .add('')
      .add('Happy coding !')
      .render()
  }
}
