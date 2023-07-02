import { PatcherFactory } from '../../types/index.js'
import { BasePatcher } from '../base_patcher.js'

export function eventsTyping(): PatcherFactory {
  return (runner) => new EventsTyping(runner)
}

/**
 * Rewrite the env.ts file to use the new API
 */
export class EventsTyping extends BasePatcher {
  static patcherName = 'env-config'

  invoke() {
    super.invoke()

    /**
     * Find the file that have the @ioc:Adonis/Core/Event module augmentation.
     * This may not be in the contracts/events.ts file, but in any other file
     */
    this.exit()
  }
}
