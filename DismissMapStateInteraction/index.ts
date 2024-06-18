/**
 * The user must dismiss this state to proceed (e.g. pressing the screen or a
 * button).
 */
export interface DismissMapStateInteraction {
  /**
   * Indicates the type of user interaction.
   */
  readonly type: 'dismiss'

  /**
   * The state index to which to jump when this current state is dismissed.
   */
  readonly stateIndex: number
}

/* c8 ignore next */
