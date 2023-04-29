import type {
  Document,
  Map,
  MapState,
  MenuMapStateInteractionOption
} from '@skitscript/types-nodejs'
import * as fs from 'fs'
import * as path from 'path'
import { map } from '.'
import { parse } from '@skitscript/parser-nodejs'

const casesPath = path.join(
  __dirname,
  'submodules',
  'skitscript',
  'mapper-test-suite',
  'cases'
)

const caseNames = fs.readdirSync(casesPath)

for (const caseName of caseNames) {
  describe(caseName, () => {
    const casePath = path.join(casesPath, caseName)

    let document: Document
    let actual: Map

    beforeAll(async () => {
      const source = await fs.promises.readFile(
        path.join(casePath, 'input.skitscript'),
        'utf8'
      )

      document = parse(source)

      if (document.type === 'valid') {
        actual = map(document)
      }
    })

    it('is parsable', () => {
      expect(document.type)
        .withContext(JSON.stringify(document, null, 2))
        .toEqual('valid')
    })

    it('generates no warnings once parsed', () => {
      if (document.type === 'valid') {
        expect(document.warnings)
          .withContext(JSON.stringify(document.warnings, null, 2))
          .toEqual([])
      }
    })

    it('maps as expected', async () => {
      if (document.type === 'valid') {
        const expectedText = await fs.promises.readFile(
          path.join(casePath, 'output.json'),
          'utf8'
        )

        const expected: Map = JSON.parse(expectedText)

        if (expected.type === 'valid') {
          const expectedValid = expected
          expect(actual.type).toEqual(expectedValid.type)

          if (actual.type === 'valid') {
            const actualValid = actual

            expect(actualValid.characters).toEqual(expectedValid.characters)

            expect(actualValid.states.length)
              .withContext(JSON.stringify(actual, null, 2))
              .toEqual(expectedValid.states.length)

            if (actualValid.states.length === expectedValid.states.length) {
              const actualStateIndicesByExpectedStateIndices: number[] = []

              const recurse = (
                expectedStateIndex: number,
                actualStateIndex: number,
                path: readonly string[]
              ): void => {
                const pathDescription = path.join(', ')

                if (
                  Object.prototype.hasOwnProperty.call(
                    actualStateIndicesByExpectedStateIndices,
                    expectedStateIndex
                  )
                ) {
                  expect(
                    actualStateIndicesByExpectedStateIndices[expectedStateIndex]
                  )
                    .withContext(pathDescription)
                    .toEqual(actualStateIndex)
                } else {
                  actualStateIndicesByExpectedStateIndices[expectedStateIndex] =
                    actualStateIndex

                  expect(actualStateIndex)
                    .withContext(pathDescription)
                    .toBeLessThan(actualValid.states.length)

                  if (actualStateIndex < actualValid.states.length) {
                    const actualState = actualValid.states[
                      actualStateIndex
                    ] as MapState
                    const expectedState = expectedValid.states[
                      expectedStateIndex
                    ] as MapState

                    expect(actualState.characters)
                      .withContext(pathDescription)
                      .toEqual(expectedState.characters)

                    expect(actualState.speakers)
                      .withContext(pathDescription)
                      .toEqual(expectedState.speakers)

                    expect(actualState.background)
                      .withContext(pathDescription)
                      .toEqual(expectedState.background)

                    expect(actualState.line)
                      .withContext(pathDescription)
                      .toEqual(expectedState.line)

                    expect(expectedState.interaction.type)
                      .withContext(pathDescription)
                      .toEqual(actualState.interaction.type)

                    const lineContent =
                      expectedState.line === null
                        ? ''
                        : `"${expectedState.line
                            .map((run) => run.plainText)
                            .join('')}"`

                    if (
                      expectedState.interaction.type === 'dismiss' &&
                      actualState.interaction.type === 'dismiss'
                    ) {
                      recurse(
                        expectedState.interaction.stateIndex,
                        actualState.interaction.stateIndex,
                        [...path, lineContent]
                      )
                    } else if (
                      expectedState.interaction.type === 'menu' &&
                      actualState.interaction.type === 'menu'
                    ) {
                      expect(expectedState.interaction.options.length)
                        .withContext(pathDescription)
                        .toEqual(actualState.interaction.options.length)

                      if (
                        expectedState.interaction.options.length ===
                        actualState.interaction.options.length
                      ) {
                        for (
                          let optionIndex = 0;
                          optionIndex <
                          expectedState.interaction.options.length;
                          optionIndex++
                        ) {
                          const expectedOption = expectedState.interaction
                            .options[
                              optionIndex
                            ] as MenuMapStateInteractionOption
                          const actualOption = actualState.interaction.options[
                            optionIndex
                          ] as MenuMapStateInteractionOption

                          expect(expectedOption.content)
                            .withContext(pathDescription)
                            .toEqual(actualOption.content)

                          recurse(
                            expectedOption.stateIndex,
                            actualOption.stateIndex,
                            [
                              ...path,
                              `${lineContent} -> "${expectedOption.content
                                .map((run) => run.plainText)
                                .join('')}"`
                            ]
                          )
                        }
                      }
                    }
                  }
                }
              }

              recurse(0, 0, [])
            }
          }
        } else {
          expect(actual).toEqual(expected)
        }
      }
    })
  })
}
