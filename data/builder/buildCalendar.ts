import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

import getCalendarData from './wiki-parser/getCalendarData'

import { getWikiUrl } from '../../src/utils'
import { inTestMode, autoGenWarning } from './'
import { SDVCalendarData } from '../structure'

export default async function buildCalendar(): Promise<void | SDVCalendarData> {
	if (inTestMode) {
		return getCalendarData(
			fs.readFileSync(
				path.resolve(__dirname, '../test_fixtures/Calendar.txt'),
				'utf-8'
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
