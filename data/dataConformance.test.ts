import * as characters from './characters'
import { SDVCharacterData } from './structure'
import { baseWikiUrl } from '../src/utils/constants'

const characterData = Object.keys(characters).map((charKey) =>
	[ characters[charKey].name, characters[charKey] ]
)

describe('Data Structure Conformance', () => {
	test.each(
		characterData
	)('data for %s contains all expected data fields', (charName, data: SDVCharacterData) => {
		const {
			avatar,
			birthday,
			bestGifts,
			canMarry,
			wiki,
			gifts
		} = data

		expect(typeof avatar).toBe('string')
		expect(typeof birthday).toBe('string')
		expect(typeof canMarry).toBe('boolean')

		expect(wiki).toMatch(baseWikiUrl)

		expect(bestGifts).toEqual(expect.arrayContaining([expect.any(String)]))
		expect(gifts).toEqual(expect.objectContaining({
			love:    expect.arrayContaining([expect.any(String)]),
			like:    expect.arrayContaining([expect.any(String)]),
			dislike: expect.arrayContaining([expect.any(String)]),
			neutral: expect.arrayContaining([expect.any(String)]),
			hate:    expect.arrayContaining([expect.any(String)]),
		}))
	})
})
