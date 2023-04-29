import { resume, start } from '@skitscript/interpreter-nodejs'
import type {
  InterpreterState,
  InterpreterStateCharacter,
  Map,
  MapStateCharacter,
  MapStateInteraction,
  MapStateRun,
  ValidDocument,
  ValidInterpreterState
} from '@skitscript/types-nodejs'
import objectHash = require('object-hash')

interface RecursedDismissInterpreterState {
  readonly type: 'dismiss'
  readonly interpreterState: ValidInterpreterState
  next?: RecursedInterpreterState
}

interface RecursedMenuInterpreterState {
  readonly type: 'menu'
  readonly interpreterState: ValidInterpreterState
  readonly options: RecursedInterpreterState[]
}

type RecursedInterpreterState =
  | RecursedDismissInterpreterState
  | RecursedMenuInterpreterState

interface StateAppearance {
  readonly characters: readonly MapStateCharacter[]
  readonly speakers: readonly string[]
  readonly background: null | string
  readonly line: null | readonly MapStateRun[]
  readonly options: null | ReadonlyArray<readonly MapStateRun[]>
}

interface StateAppearanceRecord {
  readonly stateAppearance: StateAppearance
  readonly recursedInterpreterStates: RecursedInterpreterState[]
}

const generateMapStateCharacter = (
  interpreterStateCharacter: InterpreterStateCharacter
): MapStateCharacter => {
  switch (interpreterStateCharacter.state.type) {
    case 'notPresent':
      return { type: 'notPresent' }

    case 'entering':
      return {
        type: 'entering',
        emote: interpreterStateCharacter.emote,
        animation: interpreterStateCharacter.state.animation
      }

    case 'present':
      return { type: 'present', emote: interpreterStateCharacter.emote }

    case 'exiting':
      return {
        type: 'exiting',
        emote: interpreterStateCharacter.emote,
        animation: interpreterStateCharacter.state.animation
      }
  }
}

export const map = (document: ValidDocument): Map => {
  // #region Crawl the entire state space of the game.
  const recursedInterpreterStatesByInterpreterStateHashes: Record<string, RecursedInterpreterState> = {}

  const recurse = (
    interpreterState: InterpreterState
  ): null | RecursedInterpreterState => {
    let output: null | RecursedInterpreterState

    switch (interpreterState.type) {
      case 'valid':
        {
          const hash = objectHash(interpreterState)

          if (
            Object.prototype.hasOwnProperty.call(
              recursedInterpreterStatesByInterpreterStateHashes,
              hash
            )
          ) {
            output = recursedInterpreterStatesByInterpreterStateHashes[
              hash
            ] as RecursedMenuInterpreterState
          } else {
            switch (interpreterState.interaction.type) {
              case 'dismiss': {
                const newRecord: RecursedDismissInterpreterState = {
                  type: 'dismiss',
                  interpreterState
                }

                recursedInterpreterStatesByInterpreterStateHashes[hash] =
                  newRecord

                const next = recurse(
                  resume(
                    document,
                    interpreterState,
                    interpreterState.interaction.instructionIndex
                  )
                )

                if (next === null) {
                  output = null
                } else {
                  newRecord.next = next
                  output = newRecord
                }
              } break

              case 'menu': {
                const newRecord: RecursedMenuInterpreterState = {
                  type: 'menu',
                  interpreterState,
                  options: []
                }

                recursedInterpreterStatesByInterpreterStateHashes[hash] =
                  newRecord

                for (const option of interpreterState.interaction.options) {
                  const next = recurse(
                    resume(document, interpreterState, option.instructionIndex)
                  )

                  if (next === null) {
                    return null
                  } else {
                    newRecord.options.push(next)
                  }
                }

                return newRecord
              }
            }
          }
        } break

      case 'invalid':
        switch (interpreterState.error.type) {
          case 'infiniteLoop':
            output = null
        }
    }

    return output
  }

  const startingRecursedInterpreterState = recurse(start(document))
  // #endregion

  if (startingRecursedInterpreterState === null) {
    return {
      type: 'invalid',
      error: {
        type: 'infiniteLoop'
      }
    }
  } else {
    // #region Ensure that the starting state is first.
    const recursedInterpreterStates = Object.values(
      recursedInterpreterStatesByInterpreterStateHashes
    )

    recursedInterpreterStates.splice(
      recursedInterpreterStates.indexOf(startingRecursedInterpreterState),
      1
    )

    recursedInterpreterStates.unshift(startingRecursedInterpreterState)
    // #endregion

    // #region Group the crawled states by their appearances; identical-looking
    //         states will be held together.
    const stateAppearanceRecordsByStateApperanceHashes: Record<string, StateAppearanceRecord> = {}

    for (const recursedInterpreterState of recursedInterpreterStates) {
      const stateAppearance: StateAppearance = {
        characters: recursedInterpreterState.interpreterState.characters.map(
          (character) => generateMapStateCharacter(character)
        ),
        speakers: recursedInterpreterState.interpreterState.speakers,
        background: recursedInterpreterState.interpreterState.background,
        line:
          recursedInterpreterState.interpreterState.line === null
            ? null
            : recursedInterpreterState.interpreterState.line.map((run) => ({
              bold: run.bold,
              italic: run.italic,
              code: run.code,
              plainText: run.plainText
            })),
        options:
          recursedInterpreterState.interpreterState.interaction.type ===
          'dismiss'
            ? null
            : recursedInterpreterState.interpreterState.interaction.options.map(
              (option) =>
                option.content.map((run) => ({
                  bold: run.bold,
                  italic: run.italic,
                  code: run.code,
                  plainText: run.plainText
                }))
            )
      }

      const stateAppearanceHash = objectHash(stateAppearance)

      if (
        Object.prototype.hasOwnProperty.call(
          stateAppearanceRecordsByStateApperanceHashes,
          stateAppearanceHash
        )
      ) {
        (
          stateAppearanceRecordsByStateApperanceHashes[
            stateAppearanceHash
          ] as StateAppearanceRecord
        ).recursedInterpreterStates.push(recursedInterpreterState)
      } else {
        stateAppearanceRecordsByStateApperanceHashes[stateAppearanceHash] = {
          stateAppearance,
          recursedInterpreterStates: [recursedInterpreterState]
        }
      }
    }
    // #endregion

    // #region Ensure that the state appearance record with the starting
    //         recursed interpreter state is first.
    const stateAppearanceRecords = Object.values(
      stateAppearanceRecordsByStateApperanceHashes
    )

    const indexOfStateAppearanceRecordContainingStartingRecursedInterpreterState =
      stateAppearanceRecords.findIndex((stateAppearanceRecord) =>
        stateAppearanceRecord.recursedInterpreterStates.includes(
          startingRecursedInterpreterState
        )
      )
    stateAppearanceRecords.unshift(
      stateAppearanceRecords[
        indexOfStateAppearanceRecordContainingStartingRecursedInterpreterState
      ] as StateAppearanceRecord
    )
    stateAppearanceRecords.splice(
      indexOfStateAppearanceRecordContainingStartingRecursedInterpreterState +
        1,
      1
    )
    // #endregion

    // #region Merge visually identical states.  This is an iterative process;
    //         it is possible that long parallel chains of identical states
    //         exist, and each pass will merge at least one set of matching
    //         "links".
    let thisIterationMadeChanges = true

    while (thisIterationMadeChanges) {
      thisIterationMadeChanges = false

      for (const stateAppearanceRecord of stateAppearanceRecords) {
        for (
          let i = 0;
          i < stateAppearanceRecord.recursedInterpreterStates.length;
          i++
        ) {
          const firstRecursedInterpreterState = stateAppearanceRecord
            .recursedInterpreterStates[i] as RecursedInterpreterState

          for (
            let j = i + 1;
            j < stateAppearanceRecord.recursedInterpreterStates.length;

          ) {
            const secondRecursedInterpreterState = stateAppearanceRecord
              .recursedInterpreterStates[j] as RecursedInterpreterState

            if (
              (firstRecursedInterpreterState.type === 'dismiss' &&
                secondRecursedInterpreterState.type === 'dismiss' &&
                firstRecursedInterpreterState.next ===
                  secondRecursedInterpreterState.next) ||
              (firstRecursedInterpreterState.type === 'menu' &&
                secondRecursedInterpreterState.type === 'menu' &&
                firstRecursedInterpreterState.options.length ===
                  secondRecursedInterpreterState.options.length &&
                firstRecursedInterpreterState.options.every(
                  (firstOption, optionIndex) =>
                    firstOption ===
                    secondRecursedInterpreterState.options[optionIndex]
                ))
            ) {
              stateAppearanceRecord.recursedInterpreterStates.splice(j, 1)

              for (const stateAppearanceRecord of stateAppearanceRecords) {
                for (const recursedInterpreterState of stateAppearanceRecord.recursedInterpreterStates) {
                  switch (recursedInterpreterState.type) {
                    case 'dismiss':
                      if (
                        recursedInterpreterState.next ===
                        secondRecursedInterpreterState
                      ) {
                        recursedInterpreterState.next =
                          firstRecursedInterpreterState
                      }
                      break

                    case 'menu':
                      for (
                        let optionIndex = 0;
                        optionIndex < recursedInterpreterState.options.length;
                        optionIndex++
                      ) {
                        if (
                          recursedInterpreterState.options[optionIndex] ===
                          secondRecursedInterpreterState
                        ) {
                          recursedInterpreterState.options[optionIndex] =
                            firstRecursedInterpreterState
                        }
                      }
                      break
                  }
                }
              }

              thisIterationMadeChanges = true
            } else {
              j++
            }
          }
        }
      }
    }
    // #endregion

    // #region Convert these states to the interchange format and return them.
    const recursedInterpreterStatesInStateOrder =
      stateAppearanceRecords.flatMap(
        (stateAppearanceRecord) =>
          stateAppearanceRecord.recursedInterpreterStates
      )

    const generateMapStateInteraction = (
      stateAppearanceRecord: StateAppearanceRecord,
      recursedInterpreterState: RecursedInterpreterState
    ): MapStateInteraction => {
      switch (recursedInterpreterState.type) {
        case 'dismiss':
          return {
            type: 'dismiss',
            stateIndex: recursedInterpreterStatesInStateOrder.indexOf(
              recursedInterpreterState.next as RecursedInterpreterState
            )
          }

        case 'menu':
          return {
            type: 'menu',
            options: (
              stateAppearanceRecord.stateAppearance.options as ReadonlyArray<
              readonly MapStateRun[]
              >
            ).map((content, optionIndex) => ({
              content,
              stateIndex: recursedInterpreterStatesInStateOrder.indexOf(
                recursedInterpreterState.options[
                  optionIndex
                ] as RecursedInterpreterState
              )
            }))
          }
      }
    }

    return {
      type: 'valid',
      characters:
        startingRecursedInterpreterState.interpreterState.characters.map(
          (character) => ({
            normalized: character.normalized,
            verbatim: character.verbatim
          })
        ),
      states: stateAppearanceRecords.flatMap((stateAppearanceRecord) =>
        stateAppearanceRecord.recursedInterpreterStates.map(
          (recursedInterpreterState) => ({
            characters: stateAppearanceRecord.stateAppearance.characters,
            speakers: stateAppearanceRecord.stateAppearance.speakers,
            background: stateAppearanceRecord.stateAppearance.background,
            line: recursedInterpreterState.interpreterState.line,
            interaction: generateMapStateInteraction(
              stateAppearanceRecord,
              recursedInterpreterState
            )
          })
        )
      )
    }
    // #endregion
  }
}
