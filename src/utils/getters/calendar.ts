import {
	DayOfSeason,
	DayOfWeek,
	daysOfWeek,
	Season,
} from '../../../data/structure'

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
export function getNextSeason(season: Season): Season {
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
 * Given a day of the season, return what day of the week it is
 * @param day The number of the day of the season (ie: the {15}th of Spring) (( one-indexed ))
 */
export function getWeekday(day: DayOfSeason): DayOfWeek {
	return daysOfWeek[(parseInt(day) - 1) % 7]
}
