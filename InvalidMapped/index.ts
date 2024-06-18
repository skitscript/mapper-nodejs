import type { MapError } from '../MapError'

/**
 * The result of unsuccessfully mapping a parsed document.
 */
export interface InvalidMapped {
  /**
   * Indicates the type of result.
   */
  readonly type: 'invalid'

  /**
   * The error which was encountered.
   */
  readonly error: MapError
}

/* c8 ignore next */
