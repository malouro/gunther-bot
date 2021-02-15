import cheerio from 'cheerio'
import { getWikiUrl, getAvatarUrl, getDayOfSeason } from '../utils'
import {
	SDVCharacterData,
	SDVCalendarData,
	SDVCalendarSeason,
	SDVCharacterList,
	SDVDate,
	DayOfSeason,
	Season,
	daysOfWeek,
	daysOfSeason,
	SDVCalendarDay,
	seasons,
} from './structs'

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
		avatar: getAvatarUrl(imageSrc),
		birthday: getInfoBoxData('Birthday').text().trim(),
		bestGifts: gifts,
		canMarry: Boolean(getInfoBoxData('Marriage').text().trim().toLowerCase() === 'yes'),
		wiki: getWikiUrl(characterName),
	}
}

export function getCalendarData(html: string): SDVCalendarData {
	const $ = cheerio.load(html)

	const builtCalendar: SDVCalendarData = {}
	const seasonSelector = (season: Season) => $(`#${season}`)
	const calendarSection = '#calendartable'

	function buildDay(season: Season, week: number, dayOfWeekIndex: number, dateCell): SDVCalendarDay {
		let innerText = $(dateCell).text()
		const date: SDVDate = {
			season,
			dayOfWeek: daysOfWeek[dayOfWeekIndex],
			day: daysOfSeason[getDayOfSeason(week, dayOfWeekIndex)]
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
			events
		}
	}
	
	function buildSeason(season: Season): SDVCalendarSeason {
		const builtSeason: SDVCalendarSeason = {}
		const days: Array<SDVCalendarDay> = []

		const seasonSection = seasonSelector(season).parent().nextUntil(calendarSection)
		const tableRows = seasonSection.find('tr').map((_, row) => $(row)).get()

		tableRows.forEach((row, week) => {
			$(row)
				.find('td')
				.map((_, column) => $(column))
				.get()
				.forEach((dateCell, dayOfWeekIndex) => {
					days.push(buildDay(season, week, dayOfWeekIndex, dateCell))
			})
		})

		for (let i = 0; i < 28; i++) {
			builtSeason[daysOfSeason[i]] = days[i]
		}

		return builtSeason
	}

	seasons.forEach(season => {
		builtCalendar[season] = buildSeason(season)
	})

	return builtCalendar
}
