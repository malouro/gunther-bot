#!/usr/bin/env node
import yargs from 'yargs'

import buildCrops from './crops'

export type BuildTypes = 'crops' | 'all'
export const buildTypeChoices: ReadonlyArray<BuildTypes> = ['crops', 'all']

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
		default: process.env.NODE_ENV === 'test',
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
		case 'crops':
			buildCrops()
			break
		case 'all':
		default:
			buildCrops()
			break
	}
}
