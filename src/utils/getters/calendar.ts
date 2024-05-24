import { Calendar } from '@/data'
import {
	SDVCalendarDate,
	SDVDayOfSeason,
	SDVDayOfWeek,
	SDVSeason,
	SDVSeasonShorthand,
	daysInASeason,
	daysOfSeason,
	daysOfWeek,
	seasons,
	seasonShorthands,
	SDVCalendarDay,
	daysInAWeek,
} from '@/data/types'

/**
 * Given zero-indexed values for the week and day of the week,
 * return another zero-indexed value for which day of the season it is.
 * @param week Week of the season [0-3]
 * @param dayOfWeek Day of the week [0-6]
 * @returns dayOfSeason - (ie: the {15}th of Spring) (( zero-indexed ))
 */
export function getDayOfSeason(week: number, dayOfWeek: number): number {
	if (week < 0 || week > 3) {
		throw new Error('`week` must be between [0-3]')
	}
	if (dayOfWeek < 0 || dayOfWeek > 6) {
		throw new Error('`dayOfWeek` must be between [0-6]')
	}
	return week * 7 + dayOfWeek
}

/**
 * Get the next upcoming season
 * @param season Current season
 */
export function getNextSeason(season: SDVSeason): SDVSeason {
	switch (season) {
		case 'Spring':
			return 'Summer'
		case 'Summer':
			return 'Fall'
		case 'Fall':
			return 'Winter'
		case 'Winter':
			return 'Spring'
		default:
			throw new Error(`"${season}" is not a valid season`)
	}
}

/**
 * Get the next X upcoming days on the calendar.
 * @param season
 * @param currentDay
 * @param nextXDays
 * @returns Array of calendar days that are upcoming
 */
export function getUpcomingDays(
	season: SDVSeason,
	currentDay: SDVDayOfSeason,
	nextXDays = daysInAWeek
): Array<SDVCalendarDay> {
	const calendarSeason = Calendar[season]
	const upcomingDays: SDVCalendarDay[] = []

	for (let x = 1; x <= nextXDays; x++) {
		const currentDayNumber = Number(currentDay)
		let nextDayToPush = currentDayNumber + x
		let currentSeason = calendarSeason

		if (nextDayToPush > daysInASeason) {
			nextDayToPush = nextDayToPush % daysInASeason
			currentSeason = Calendar[getNextSeason(season)]
		}
		upcomingDays.push(currentSeason.days[nextDayToPush])
	}

	return upcomingDays
}

/**
 * Given a day of the season, return what day of the week it is
 * @param day The number of the day of the season (ie: the {15}th of Spring) (( one-indexed ))
 */
export function getWeekday(day: SDVDayOfSeason): SDVDayOfWeek {
	return daysOfWeek[(parseInt(day) - 1) % 7]
}

const nullDate: SDVCalendarDate = {
	season: null,
	day: null,
}

/**
 * Returns a date on the calendar, given an input string
 * @param val {string}
 * @returns {SDVCalendarDate}
 */
export function getDate(val: string): SDVCalendarDate {
	const parsedSeason = [...seasons, ...seasonShorthands].find(possibleSeason =>
		val.toLocaleLowerCase().startsWith(possibleSeason.toLocaleLowerCase())
	)

	let season: SDVSeason

	switch (parsedSeason) {
		case 'sp':
			season = 'Spring'
			break
		case 'su':
			season = 'Summer'
			break
		case 'f':
		case 'fa':
			season = 'Fall'
			break
		case 'w':
		case 'wi':
			season = 'Winter'
			break
		default:
			if (!seasons.includes(parsedSeason)) {
				return nullDate
			}
			season = parsedSeason
			break
	}

	let inferredDay = val
		.toLocaleLowerCase()
		.replace(parsedSeason.toLocaleLowerCase(), '')
		.trim()

	if (/\s+/.test(inferredDay)) {
		inferredDay = inferredDay.split(/\s+/)[0]
	}

	const dayAsNumber = parseInt(inferredDay)

	if (Number.isNaN(dayAsNumber) && inferredDay !== '') {
		return nullDate
	}

	const day = inferredDay && daysOfSeason[dayAsNumber - 1]

	if (dayAsNumber > daysInASeason || dayAsNumber <= 0) {
		return nullDate
	}
	if (!day) {
		return {
			season,
			day: null,
		}
	}
	return {
		season,
		day,
	}
}

/**
 * Checks that input was a valid SDV date.
 *
 * A valid SDV date starts with the full string for any season name,
 * or season shorthand name, and optionally includes a number value
 * from [1-28]. (ie: "summer 5")
 *
 * @param val Some user inputted string to check if is a date
 * @returns {boolean} Whether the input was a valid SDV date or not.
 */
export function checkDate(
	val: string | SDVSeason | SDVSeasonShorthand
): boolean {
	const { season } = getDate(val)

	return Boolean(season)
}
