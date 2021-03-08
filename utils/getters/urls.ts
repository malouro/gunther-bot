import { baseWikiUrl } from '../constants'

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
