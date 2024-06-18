import type { DismissMapStateInteraction } from '../DismissMapStateInteraction'
import type { MenuMapStateInteraction } from '../MenuMapStateInteraction'

/**
 * Describes how the user interacts with a state within the result of mapping a
 * parsed document.
 */
export type MapStateInteraction =
  | DismissMapStateInteraction
  | MenuMapStateInteraction

/* c8 ignore next */
