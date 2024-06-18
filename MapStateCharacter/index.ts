import type { EnteringMapStateCharacter } from '../EnteringMapStateCharacter'
import type { ExitingMapStateCharacter } from '../ExitingMapStateCharacter'
import type { NotPresentMapStateCharacter } from '../NotPresentMapStateCharacter'
import type { PresentMapStateCharacter } from '../PresentMapStateCharacter'

/**
 * A character within the result of mapping a parsed document.
 */
export type MapStateCharacter =
  | NotPresentMapStateCharacter
  | EnteringMapStateCharacter
  | PresentMapStateCharacter
  | ExitingMapStateCharacter

/* c8 ignore next */
