/**
 * A run of formatted text within the result of mapping a parsed document.
 */
export interface MapStateRun {
  /**
   * When true, the run is to be displayed in bold.  It is to otherwise be
   * displayed using the default font weight.
   */
  readonly bold: boolean

  /**
   * When true, the run is to be displayed in italics.  It is to otherwise be
   * displayed upright.
   */
  readonly italic: boolean

  /**
   * When true, the run is to be displayed in a mono-space font.  It is to
   * otherwise be displayed using the default font.
   */
  readonly code: boolean

  /**
   * The run's plain text content as parsed from the document.
   */
  readonly plainText: string
}

/* c8 ignore next */
