import type { MapCharacter } from '../MapCharacter'
import type { MapState } from '../MapState'

/**
 * The result of successfully mapping a parsed document.
 */
export interface ValidMapped {
  /**
   * Indicates the type of result.
   */
  readonly type: 'valid'

  /**
   * The characters found within the parsed document.
   */
  readonly characters: readonly MapCharacter[]

  /**
   * The states which were found in the parsed document.
   * There is always at least one.
   * The user is first be shown the first.
   */
  readonly states: readonly MapState[]
}

/* c8 ignore next */
