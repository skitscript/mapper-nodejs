/**
 * A character which is currently entering view within the result of mapping a
 * parsed document.
 */
export interface EnteringMapStateCharacter {
  /**
   * Indicates the state of the character.
   */
  readonly type: 'entering'

  /**
   * The (normalized) name of the emote the character is currently displaying.
   */
  readonly emote: string

  /**
   * The (normalized) name of the entry animation.
   */
  readonly animation: string
}

/* c8 ignore next */
