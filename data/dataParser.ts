import cheerio from 'cheerio'
import { getWikiUrl, getImageUrl, getDayOfSeason } from '../src/utils'
import {
	SDVCharacterData,
	SDVCharacterList,
	SDVCalendarData,
	SDVCalendarDate,
	SDVCalendarDay,
	SDVCalendarSeason,
	Season,
	daysOfWeek,
	daysOfSeason,
	seasons,
} from './structure'

/**
 * Generate a character data object based on fetched Wiki HTML
 * @param {string} html HTML content as string
 */
export function getCharacterData(html: string): SDVCharacterData {
	const $ = cheerio.load(html)
	const characterName = $('h1').text().trim()

	// Common selectors
	/* cspell: disable-next-line */
	const infoBoxSection = '#infoboxsection'
	/* cspell: disable-next-line */
	const infoBoxDetail = '#infoboxdetail'

	/**
	 * Get data from the side info box section
	 * @param {string} fieldName Name of field to look for in info box
	 */
	function getInfoBoxData(fieldName) {
		return $(infoBoxSection)
			.filter((_, element) => $(element).text().includes(fieldName))
			.next(infoBoxDetail)
	}

	const gifts = []
	const imageSrc = $(`img[alt="${characterName}.png"]`).attr('src')

	$(getInfoBoxData('Best Gifts'))
		.find('a')
		.each((_, gift) => gifts.push($(gift).text().toString().trim()))

	return {
		name: characterName,
		avatar: getImageUrl(imageSrc),
		birthday: getInfoBoxData('Birthday').text().trim(),
		bestGifts: gifts,
		canMarry: Boolean(
			getInfoBoxData('Marriage').text().trim().toLowerCase() === 'yes'
		),
		wiki: getWikiUrl(characterName),
	}
}

export function getCalendarData(html: string): SDVCalendarData {
	const $ = cheerio.load(html)

	const builtCalendar: SDVCalendarData = {}
	const seasonSelector = (season: Season) => $(`h2 > #${season}`)
	const calendarSection = '#calendar'

	function buildDay(
		season: Season,
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
					innerText = innerText.replace(character, '').trim()
				}
			})

			if (innerText != '') {
				events.push(innerText.trim())
			}
		}

		return {
			date,
			birthdays,
			events,
		}
	}

	function buildSeason(season: Season): SDVCalendarSeason {
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

		for (let i = 0; i < 28; i++) {
			builtSeason.days[daysOfSeason[i]] = days[i]
		}

		return builtSeason
	}

	seasons.forEach(season => {
		builtCalendar[season] = buildSeason(season)
	})

	// builtCalendar.Summer = buildSeason('Summer')

	return builtCalendar
}
