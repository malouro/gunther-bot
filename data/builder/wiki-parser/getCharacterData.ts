import cheerio from 'cheerio'
import flatten from 'lodash.flatten'
import { getWikiUrl, getImageUrl } from '../../../src/utils'
import {
	SDVCharacterData,
	SDVGiftTypes,
	SDVGifts,
	giftTypes,
} from '../../structure'

/* cspell: disable */
const CHARACTER_SELECTORS = {
	infoBoxSection: '#infoboxsection',
	infoBoxDetail: '#infoboxdetail',
	giftTable: 'table.wikitable',
}
/* cspell: enable */

/**
 * Generate a character data object based on fetched Wiki HTML
 * @param {string} html HTML content as string
 */
export default function getCharacterData(html: string): SDVCharacterData {
	const $ = cheerio.load(html)
	const gifts: SDVGifts = {}
	const bestGifts: Array<string> = []

	/**
	 * Get data from the side info box section
	 * @param {string} fieldName Name of field to look for in info box
	 */
	function getInfoBoxData(fieldName: string) {
		return $(CHARACTER_SELECTORS.infoBoxSection)
			.filter((_: unknown, element) => $(element).text().includes(fieldName))
			.next(CHARACTER_SELECTORS.infoBoxDetail)
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
		const tableBody = $(section)
			.nextAll(CHARACTER_SELECTORS.giftTable)
			.first()
			.find('tbody')

		$(tableBody)
			.children()
			.each((_, row) => {
				const itemText = $($(row).find('td').toArray()[1])
					.text()
					.trim()
					.replace(/\s+/g, ' ')
				if (itemText !== '') {
					gifts.push(itemText)
				}
			})

		return gifts
	}

	const characterName = $('h1').text().trim()
	const imageSrc = $(`img[alt="${characterName}.png"]`).attr('src')

	giftTypes.forEach((giftType: SDVGiftTypes) => {
		const giftList = getGiftInfo(giftType)
		gifts[giftType] = flatten(
			giftList.map((data: string) =>
				data.split(/\s*All\s+/).filter(element => element !== '')
			)
		)
	})

	$(getInfoBoxData('Best Gifts'))
		.find('a')
		.each((_, gift) => {
			bestGifts.push(
				$(gift).text().toString().trim().replace(/\s+/g, ' ')
			)
		})

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
