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
      'CiAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8gICAgICAgICAgICBfICAgIF8gXyAgIAogIF9fIF8gIF9ffCB8IF9fXyAgICAgICAgXyAgIF8gXyBfXyAgIF9fIF8gXyBfXyBfXyBfICBfX3wgfCBfX18gICAgICB8IHwgXyhfKSB8XyAKIC8gX2AgfC8gX2AgfC8gXyBcIF9fX19ffCB8IHwgfCAnXyBcIC8gX2AgfCAnX18vIF9gIHwvIF9gIHwvIF8gXF9fX19ffCB8LyAvIHwgX198CnwgKF98IHwgKF98IHwgKF8pIHxfX19fX3wgfF98IHwgfF8pIHwgKF98IHwgfCB8IChffCB8IChffCB8ICBfXy9fX19fX3wgICA8fCB8IHxfIAogXF9fLF98XF9fLF98XF9fXy8gICAgICAgXF9fLF98IC5fXy8gXF9fLCB8X3wgIFxfXyxffFxfXyxffFxfX198ICAgICB8X3xcX1xffFxfX3wKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfF98ICAgIHxfX18vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCg==',
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
