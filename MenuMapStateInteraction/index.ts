import type { MenuMapStateInteractionOption } from '../MenuMapStateInteractionOption'

/**
 * The user must select an option from a menu.
 */
export interface MenuMapStateInteraction {
  /**
   * Indicates the type of user interaction.
   */
  readonly type: 'menu'

  /**
   * The options which are listed in the menu.
   */
  readonly options: readonly MenuMapStateInteractionOption[]
}

/* c8 ignore next */
