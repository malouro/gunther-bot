import cheerio from 'cheerio'
import { getWikiUrl, getImageUrl, getDayOfSeason } from '../../../src/utils'
import {
	SDVCharacterList,
	SDVCalendarData,
	SDVCalendarDate,
	SDVCalendarDay,
	SDVCalendarSeason,
	SDVSeason,
	daysInASeason,
	daysOfWeek,
	daysOfSeason,
	seasons,
} from '../../types'

export default function getCalendarData(html: string): SDVCalendarData {
	const $ = cheerio.load(html)

	const builtCalendar: SDVCalendarData = {}
	const seasonSelector = (season: SDVSeason) => $(`h2 > #${season}`)
	const calendarSection = '#calendar'

	function buildDay(
		season: SDVSeason,
		week: number,
		dayOfWeekIndex: number,
		dateCell
	): SDVCalendarDay {
		let innerText = $(dateCell).text()
		const date: SDVCalendarDate = {
			season,
			dayOfWeek: daysOfWeek[dayOfWeekIndex],
			day: daysOfSeason[getDayOfSeason(week, dayOfWeekIndex)],
		}
		const birthdays = []
		const events = []

		if (innerText) {
			SDVCharacterList.forEach(character => {
				if (innerText.includes(character)) {
					birthdays.push(character)
					innerText = innerText
						.replace(character, '')
						.trim()
						.replace(/\s+/g, ' ')
				}
			})

			if (innerText != '') {
				events.push(innerText.trim().replace(/\s+/g, ' '))
			}
		}

		return {
			date,
			birthdays,
			events,
		}
	}

	function buildSeason(season: SDVSeason): SDVCalendarSeason {
		const days: Array<SDVCalendarDay> = []
		let seasonEvents = []
		let seasonBirthdays = []

		const seasonSection = seasonSelector(season).parent()
		const seasonCalendarSection = seasonSection
			.nextAll(calendarSection)
			.first()
			.children('#calendartable')
			.children()
			.first()
		const seasonCalendarImage = seasonSection
			.nextAll(calendarSection)
			.first()
			.children()
			.first()
			.attr('src')
		const tableRows = $(seasonCalendarSection)
			.children('tr')
			.map((_, row) => $(row))
			.get()

		tableRows.forEach((row, week) => {
			$(row)
				.children('td')
				.map((_, column) => $(column))
				.get()
				.forEach((dateCell, dayOfWeekIndex) => {
					const { date, birthdays, events } = buildDay(
						season,
						week,
						dayOfWeekIndex,
						dateCell
					)

					seasonEvents = seasonEvents.concat(
						events.filter(item => !seasonEvents.includes(item))
					)
					seasonBirthdays = seasonBirthdays.concat(birthdays)

					days.push({
						date,
						birthdays,
						events,
					})
				})
		})

		const builtSeason: SDVCalendarSeason = {
			days: {},
			image: getImageUrl(seasonCalendarImage),
			wiki: getWikiUrl(season),
			events: seasonEvents,
			birthdays: seasonBirthdays,
		}

		for (let i = 0; i < daysInASeason; i++) {
			builtSeason.days[daysOfSeason[i]] = days[i]
		}

		return builtSeason
	}

	seasons.forEach(season => {
		builtCalendar[season] = buildSeason(season)
	})

	return builtCalendar
}
