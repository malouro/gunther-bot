#!/usr/bin/env node
import { writeFileSync } from 'fs'
import { buildTypeChoices } from './xnb-builder'
import { resolve } from 'path'
import { rimrafSync } from 'rimraf'

const dirs = buildTypeChoices.filter(b => b !== 'all')

// NOTE ABOUT THIS SCRIPT:

// Since all of the builder scripts are written in TypeScript,
// deleting the generated data content can often break the TypeScript compilation
// and thus block the data builder scripts from running to begin with.

// To circumvent, we clean the directories and replace with a dummy "index.ts" file
// to satisfy the bear minimum to run the build script afterwards.

for (const dir of dirs) {
	const pathToDir = resolve(__dirname, '../', dir)

	rimrafSync(`${pathToDir}/*`, { glob: true })
	writeFileSync(
		resolve(pathToDir, 'index.ts'),
		`// Data has been purged. Run "yarn build:data"!
export {}`
	)
}
