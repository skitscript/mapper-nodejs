import type { MapStateRun } from '../MapStateRun'

/**
 * An option the user can select from a menu.
 */
export interface MenuMapStateInteractionOption {
  /**
   * The content of the menu option as shown to the user.
   */
  readonly content: readonly MapStateRun[]

  /**
   * The state index to which to jump when the menu option is selected.
   */
  readonly stateIndex: number
}

/* c8 ignore next */
