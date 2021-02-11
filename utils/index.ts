import { SDVCharacterName } from '../data/structs'

/**
 * Get a URL to the Wiki for a given search term
 * @param term Search term to get URL for
 */
export function getWikiUrl(term: string): string {
	return `https://stardewcommunitywiki.com/${term}`
}

export function getAvatarUrl(imgSrc: string): string {
	return `https://stardewcommunitywiki.com${imgSrc[0] === '/' ? imgSrc : '/' + imgSrc}`
}

/**
 * Returns a proper capitalized & formatted character name
 * @param name String of the character's name to format properly
 */
export function formatCharacterName(name: string): SDVCharacterName {
	return `${name.charAt(0).toLocaleUpperCase()}${name.slice(1).toLocaleLowerCase()}`
}
