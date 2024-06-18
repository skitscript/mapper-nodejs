/**
 * A character which is currently not present within the result of mapping a
 * parsed document.
 */
export interface NotPresentMapStateCharacter {
  /**
   * Indicates the state of the character.
   */
  readonly type: 'notPresent'
}

/* c8 ignore next */
