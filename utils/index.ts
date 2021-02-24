import {
	DayOfSeason,
	DayOfWeek,
	daysOfWeek,
	SDVCharacterName,
	Season,
} from '../data/structure'

export const baseWikiUrl = 'https://stardewcommunitywiki.com'
export const messageEmojis = {
	birthday: '🎂',
	event: '🚩'
}

/**
 * Get a URL to the Wiki for a given search term
 * @param term Search term to get URL for
 */
export function getWikiUrl(term: string): string {
	return `${baseWikiUrl}/${term}`
}

/**
 * Returns a URL to a Wiki image
 * @param imgSrc `src` attribute on the <img>
 */
export function getImageUrl(imgSrc: string): string {
	return `${baseWikiUrl}${imgSrc[0] === '/' ? imgSrc : '/' + imgSrc}`
}

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

/**
 * Returns a proper capitalized & formatted character name
 * @param name String of the character's name to format properly
 */
export function formatCharacterName(name: string): SDVCharacterName {
	return `${name.charAt(0).toLocaleUpperCase()}${name
		.slice(1)
		.toLocaleLowerCase()}`
}
