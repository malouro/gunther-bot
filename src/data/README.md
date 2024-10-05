# Stardew Valley JSON Data

This directory exports data depicting values & information related to Stardew Valley characters, events, items and more.

These values are pulled from XNB unpacked data straight from the Stardew Valley install folder ([see `StardewXnbHack`](https://github.com/Pathoschild/StardewXnbHack#readme)) via the [`xnb-builder`](./builder/xnb-builder/) script.

> **Deprecated** `wiki-builder` is now not supported.
>
> Old data was gathered via some web crawling through the Wiki. This wasn't effecient however,
> and was difficult to keep up-to-date considering that formatting changes alone could break the build.

## Content & Usage

Within `data`, and exported as `SDVData` from the `gunther-bot` package, is the available JSON dataset used by the bot. It contains the following format:

```json5
"SDVData": {
	"Calendar": { ... },
	"Characters": {
		"Alex": { ... },
		"Elliott": { ... },
		// ...
	}
}
```

You can import this data like so:

```js
import { SDVData } from 'gunther-bot'
// or
import * as SDVData from 'gunther-bot/data'
```

### Data Types & Structure

Additionally, the structure and shape of the inner data elements is further described within `data/types`. This is used as TypeScript definitions during development, as well as for importing the dataset yourself and inferring types of potential user input.

(ie: if the bot is expecting a `SDVCharacterName`, and user inputs `"Alex"` -> ✅; if user inputs `"Pink Cake"` -> ❌)

You can import and use this like so:

```js
import { SDVDataStructure } from 'gunther-bot'

console.log(SDVDataStructure.SDVCharacterList) // Outputs:
/*[
  'Alex',     'Elliott',   'Harvey',
  'Sam',      'Sebastian', 'Shane',
  'Abigail',  'Emily',     'Haley',
  'Leah',     'Maru',      'Penny',
  'Caroline', 'Clint',     'Demetrius',
  'Dwarf',    'Evelyn',    'George',
  'Gus',      'Jas',       'Jodi',
  'Kent',     'Krobus',    'Leo',
  'Lewis',    'Linus',     'Marnie',
  'Pam',      'Pierre',    'Robin',
  'Sandy',    'Vincent',   'Willy',
  'Wizard'
]*/
```

Furthermore, type definition files are built & exported for TypeScript support:

```txt
gunther-bot\
\_____ cjs\
   |_____ data\
   \_____ src\
       |_ index.js   // <-- package entry point
       \_ index.d.ts // <-- type definitions!
```

### Calendar

> See: https://stardewvalleywiki.com/Calendar

### Characters

> See: https://stardewvalleywiki.com/Villagers

## Building the Dataset

You can build the dataset yourself by running:

```bash
build-sdv-data [options]
```

This will write JSON into `data/*` according to the data type. (ie: `calendar.json` is generated within `data/calendar`, etc.)

Currently, this is only expected to be used for local development of the `gunther-bot` package, despite the script being exported under the package's available `bin` scripts. External use of the script is not supported fully - and probably will not be in the future.

Here are the available `[options]` for the `build-sdv-data` script:

| Option                                                          |                                  Type                                   | Default | Description                                                                                                                                                                         |
| :-------------------------------------------------------------- | :---------------------------------------------------------------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>`build-type`</li><li>`buildType`</li><li>`-b`</li></ul> | One of: <ul><li>`characters`</li><li>`calendar`</li><li>`all`</li></ul> |  `all`  | <p>Indicates the dataset you wish to build. Defaults to building _all_ data.</p><p>Eg: <code>build-sdv-data --build-type calendar</code> will build only the SDV Calendar data.</p> |
| <ul><li>`dry-run`</li><li>`test`</li><li>`-t`</li></ul>         |                                `boolean`                                | `false` | <p>Indicates that you wish to run the build against test data.</p><p>This does not update or write any output, only logs the JSON to the console.</p>                               |
| <ul><li>`help`</li><li>`-h`</li></ul>                           |                                   ---                                   |   ---   | Opens help menu.                                                                                                                                                                    |
