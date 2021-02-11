import cheerio from 'cheerio'
import { getWikiUrl, getAvatarUrl } from '../utils'
import { SDVCharacterData } from './structs'

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
