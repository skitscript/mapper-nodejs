/**
 * A character which is currently exiting view within the result of mapping a
 * parsed document.
 */
export interface ExitingMapStateCharacter {
  /**
   * Indicates the state of the character.
   */
  readonly type: 'exiting'

  /**
   * The (normalized) name of the emote the character is currently displaying.
   */
  readonly emote: string

  /**
   * The (normalized) name of the exit animation.
   */
  readonly animation: string
}

/* c8 ignore next */
