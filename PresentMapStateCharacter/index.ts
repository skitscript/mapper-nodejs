/**
 * A character which is currently present (and not animating) within the result
 * of mapping a parsed document.
 */
export interface PresentMapStateCharacter {
  /**
   * Indicates the state of the character.
   */
  readonly type: 'present'

  /**
   * The (normalized) name of the emote the character is currently displaying.
   */
  readonly emote: string
}

/* c8 ignore next */
