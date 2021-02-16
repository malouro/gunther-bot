#!/usr/bin/env node
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { getCharacterData, getCalendarData } from './dataParser'
import { getWikiUrl } from '../utils'
import { SDVCharacterList, SDVCharacterName } from './structs'

type BuildTypes = 'characters' | 'calendar' | 'all'
const buildTypeChoices: ReadonlyArray<BuildTypes> = ['characters', 'calendar', 'all']
export interface BuildArguments {
	[x: string]: unknown
	b: BuildTypes,
	t: boolean
	_: string[]
	$0: string
}

const yargv = yargs(process.argv.slice(2))
	.usage('Usage: $0 <command> [options]')
	.option('b', {
		description: 'What type of data do you want to build/generate? (default: all)',
		choices: buildTypeChoices,
		alias: ['build-type', 'buildType']
	})
	.option('t', {
		description: 'Execute a dry-run of the build against test data',
		type: 'boolean',
		alias: ['test', 'dry-run']
	})
	.help('h')
	.alias('h', 'help')
	.argv

const { b: buildType, t: inTestMode } = yargv

const autoGenWarning = '/*\
WARNING: This file and its subsequent imports are auto-generated at build time.\
Do not edit manually.\
*/'

export async function buildCharacters(
	characters: ReadonlyArray<SDVCharacterName> = SDVCharacterList
): Promise<void> {
	if (inTestMode) {
		return console.log(
			getCharacterData(
				fs.readFileSync(
					path.resolve(__dirname,'./test_fixtures/Marnie.txt'),
					'utf-8'
				)
			)
		)
	}

	let exports = ''

	for (const character of characters) {
		const characterWiki = await fetch(getWikiUrl(character))
		const wikiHtml = await characterWiki.text()
		const characterData = getCharacterData(wikiHtml)

		exports += `import ${characterData.name} from './${characterData.name}.json'\nexport { ${characterData.name} }\n`

		fs.writeFileSync(
			path.resolve(__dirname, `./characters/${character}.json`),
			JSON.stringify(characterData)
		)
	}

	fs.writeFileSync(
		path.resolve(__dirname, './characters/index.ts'),
		`${autoGenWarning}\n\n${exports}`
	)
}

export async function buildCalendar(): Promise<void> {
	if (inTestMode) {
		return console.log(
			getCalendarData(
				fs.readFileSync(
					path.resolve(__dirname, './test_fixtures/Calendar.txt'),
					'utf-8'
				)
			)
		)
	}

	const calendarWiki = await fetch(getWikiUrl('Calendar'))
	const wikiHtml = await calendarWiki.text()
	const calendarData = getCalendarData(wikiHtml)

	fs.writeFileSync(
		path.resolve(__dirname, './calendar/calendar.json'),
		JSON.stringify(calendarData)
	)
	fs.writeFileSync(
		path.resolve(__dirname, './calendar/index.ts'),
		`${autoGenWarning}\n\nimport Calendar from './calendar.json'\nexport { Calendar }\n`
	)
}

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
