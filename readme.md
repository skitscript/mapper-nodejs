# Skitscript Mapper (NodeJS) [![Continuous Integration](https://github.com/skitscript/mapper-nodejs/workflows/Continuous%20Integration/badge.svg)](https://github.com/skitscript/mapper-nodejs/actions) [![License](https://img.shields.io/github/license/skitscript/mapper-nodejs.svg)](https://github.com/skitscript/mapper-nodejs/blob/master/license) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/) [![npm](https://img.shields.io/npm/v/@skitscript/mapper-nodejs.svg)](https://www.npmjs.com/package/@skitscript/mapper-nodejs) [![npm type definitions](https://img.shields.io/npm/types/@skitscript/mapper-nodejs.svg)](https://www.npmjs.com/package/@skitscript/mapper-nodejs)

A Skitscript document mapper targeting NodeJS.

## Installation

### Dependencies

This is a NPM package.  It targets NodeJS 20.14.0 or newer on the following
operating systems:

- Ubuntu 22.04
- Ubuntu 20.04
- macOS 13 (Ventura)
- macOS 12 (Monterey)
- macOS 11 (Big Sur)
- Windows Server 2022
- Windows Server 2019

It is likely also possible to use this package as part of a web browser
application through tools such as [webpack](https://webpack.js.org/).  This has
not been tested, however.

### Install as a runtime dependency

If your application uses this as a runtime dependency, install it like any other
NPM package:

```bash
npm install --save @skitscript/mapper-nodejs
```

### Install as a development dependency

If this is used when building your application and not at runtime, install it as
a development dependency:

```bash
npm install --save-dev @skitscript/mapper-nodejs
```

## Usage

### Parsing documents

Import the `map` function, and provide it with a parsed document to receive a
map of all reachable game states:

```typescript
import { map } from "@skitscript/mapper-nodejs";

const mapResult = map(parsedDocument);

console.log(mapResult);
```

```json
{
  "type": "valid",
  "states": [...]
}
```

### Types

A comprehensive library of types representing the results of attempting to map
parsed documents can be imported:

```typescript
import { Map } from "@skitscript/mapper-nodejs";
```

#### Maps

- [InvalidMapped](./InvalidMapped/index.ts)
- [MapCharacter](./MapCharacter/index.ts)
- [Mapped](./Mapped/index.ts)
- [MapStateRun](./MapStateRun/index.ts)
- [ValidMapped](./ValidMapped/index.ts)

#### States

- [MapState](./MapState/index.ts)

##### Characters

- [EnteringMapStateCharacter](./EnteringMapStateCharacter/index.ts)
- [ExitingMapStateCharacter](./ExitingMapStateCharacter/index.ts)
- [MapStateCharacter](./MapStateCharacter/index.ts)
- [NotPresentMapStateCharacter](./NotPresentMapStateCharacter/index.ts)
- [PresentMapStateCharacter](./PresentMapStateCharacter/index.ts)

##### Interactions

- [DismissMapStateInteraction](./DismissMapStateInteraction/index.ts)
- [MapStateInteraction](./MapStateInteraction/index.ts)
- [MenuMapStateInteraction](./MenuMapStateInteraction/index.ts)
- [MenuMapStateInteractionOption](./MenuMapStateInteractionOption/index.ts)

#### Errors

- [InfiniteLoopMapError](./InfiniteLoopMapError/index.ts)
- [MapError](./MapError/index.ts)
