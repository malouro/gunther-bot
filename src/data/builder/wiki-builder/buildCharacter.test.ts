import { getWikiUrl } from '@/utils'
import { SDVCharacterData } from '@/data/types'
import buildCharacters from './buildCharacters'

describe('Data Builder for Characters', () => {
	let results: SDVCharacterData

	beforeAll(async () => {
		results = (await buildCharacters()) as SDVCharacterData
	})

	test('matches expected output', () => {
		const expectation: SDVCharacterData = {
			name: 'Marnie',
			wiki: getWikiUrl('Marnie'),
			avatar: 'https://stardewcommunitywiki.com/Marnie_files/Marnie.webp',
			birthday: 'Fall 18',
			canMarry: false,
			gifts: {},
			bestGifts: ['Diamond', "Farmer's Lunch", 'Pink Cake', 'Pumpkin Pie'],
		}
		expect(results).toMatchObject(expectation)
	})
})
