import {
	DayOfSeason,
	DayOfWeek,
	daysOfWeek,
	SDVCharacterName,
} from '../data/structure'

export const baseWikiUrl = 'https://stardewcommunitywiki.com'

/**
 * Get a URL to the Wiki for a given search term
 * @param term Search term to get URL for
 */
export function getWikiUrl(term: string): string {
	return `${baseWikiUrl}/${term}`
}

/**
 * Returns a URL to a character's avatar
 * @param imgSrc `src` attribute on the <img>
 */
export function getAvatarUrl(imgSrc: string): string {
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
	return week * 7 + dayOfWeek
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
