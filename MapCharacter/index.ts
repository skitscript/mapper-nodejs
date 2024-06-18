/**
 * Details regarding a character found while mapping a document.
 */
export interface MapCharacter {
  /**
   * The (normalized) name of the character.
   */
  readonly normalized: string

  /**
   * The (verbatim) name of the character.
   */
  readonly verbatim: string
}

/* c8 ignore next */
