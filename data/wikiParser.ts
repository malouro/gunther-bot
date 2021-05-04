import cheerio from 'cheerio'
import flatten from 'lodash.flatten'
import { getWikiUrl, getImageUrl, getDayOfSeason } from '../src/utils'
import {
	SDVCharacterData,
	SDVCharacterList,
	SDVCalendarData,
	SDVCalendarDate,
	SDVCalendarDay,
	SDVCalendarSeason,
	SDVGifts,
	SDVGiftTypes,
	SDVSeason,
	daysOfWeek,
	daysOfSeason,
	seasons,
	giftTypes
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
	function getInfoBoxData(fieldName: string) {
		return $(infoBoxSection)
			.filter((_, element) => $(element).text().includes(fieldName))
			.next(infoBoxDetail)
	}

	/**
	 * Return info on liked/disliked gifts
	 */
	function getGiftInfo(giftType: SDVGiftTypes) {
		const gifts = []
		const section = $('h3').filter(function () {
			return new RegExp(`${giftType}s*`).test(
				$(this).text().trim().toLocaleLowerCase()
			)
		})
		const tableBody = $(section).nextAll('table.wikitable').first().find('tbody')

		$(tableBody).children().each((_, row) => {
			const itemText = $($(row).find('td').toArray()[1]).text().trim().replace(/\s+/g, ' ')
			if (itemText !== '') {
				gifts.push(itemText)
			}
		})

		return gifts
	}

	const gifts: SDVGifts = {}
	const bestGifts: Array<string> = []

	giftTypes.forEach((giftType: SDVGiftTypes) => {
		const giftList = getGiftInfo(giftType)
		gifts[giftType] = flatten(giftList.map((data: string) =>
			data.split(/\s*All\s+/).filter(element => element !== '')
		))
	})

	const imageSrc = $(`img[alt="${characterName}.png"]`).attr('src')

	$(getInfoBoxData('Best Gifts'))
		.find('a')
		.each((_, gift) => bestGifts.push($(gift).text().toString().trim().replace(/\s+/g, ' ')))

	return {
		name: characterName,
		avatar: getImageUrl(imageSrc),
		birthday: getInfoBoxData('Birthday').text().trim(),
		bestGifts: bestGifts,
		gifts,
		canMarry: Boolean(
			getInfoBoxData('Marriage').text().trim().toLowerCase() === 'yes'
		),
		wiki: getWikiUrl(characterName),
	}
}

export function getCalendarData(html: string): SDVCalendarData {
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

		for (let i = 0; i < 28; i++) {
			builtSeason.days[daysOfSeason[i]] = days[i]
		}

		return builtSeason
	}

	seasons.forEach(season => {
		builtCalendar[season] = buildSeason(season)
	})

	return builtCalendar
}
