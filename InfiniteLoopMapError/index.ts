/**
 * Mapping failed as an infinite loop which does not contain user interaction
 * was found.
 */
export interface InfiniteLoopMapError {
  /**
   * Indicates the type of map error.
   */
  readonly type: 'infiniteLoop'
}

/* c8 ignore next */
