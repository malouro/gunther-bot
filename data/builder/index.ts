#!/usr/bin/env node
import yargs from 'yargs'
import buildCalendar from './buildCalendar'
import buildCharacters from './buildCharacters'

export type BuildTypes = 'characters' | 'calendar' | 'all'
export const buildTypeChoices: ReadonlyArray<BuildTypes> = [
	'characters',
	'calendar',
	'all',
]
export interface BuildArguments {
	[x: string]: unknown
	b: BuildTypes
	t: boolean
	_: string[]
	$0: string
}

const scriptName = 'build-sdv-data'
const yargv = yargs(process.argv.slice(2))
	.usage(`Usage: ${scriptName} <command> [options]`)
	.option('b', {
		description:
			'What type of data do you want to build/generate? (default: all)',
		choices: buildTypeChoices,
		alias: ['build-type', 'buildType'],
	})
	.option('t', {
		description: 'Execute a dry-run of the build against test data',
		type: 'boolean',
		alias: ['test', 'dry-run'],
	})
	.help('h')
	.alias('h', 'help').argv

export const { b: buildType, t: inTestMode } = yargv

export const autoGenWarning =
	'/*\n\
WARNING: This file and its subsequent imports are auto-generated at build time.\n\
Do not edit manually.\n\
*/'

if (require.main === module) {
	switch (buildType) {
		case 'characters':
			buildCharacters()
			break

		case 'calendar':
			buildCalendar()
			break

		case 'all':
		default:
			buildCharacters()
			buildCalendar()
			break
	}
}
