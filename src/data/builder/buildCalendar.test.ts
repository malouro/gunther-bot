import { getWikiUrl } from '../../src/utils'
import { daysOfSeason, SDVCalendarData, SDVCharacterName } from '../types'
import buildCalendar from './buildCalendar'

const days = Object.fromEntries(
	daysOfSeason.map(number => [number, expect.any(Object)])
)
const springBirthdays: SDVCharacterName[] = [
	'Kent',
	'Lewis',
	'Vincent',
	'Haley',
	'Pam',
	'Shane',
	'Pierre',
	'Emily',
]
const summerBirthdays: SDVCharacterName[] = [
	'Jas',
	'Gus',
	'Maru',
	'Alex',
	'Sam',
	'Demetrius',
	'Dwarf',
	'Willy',
	'Leo',
]
const fallBirthdays: SDVCharacterName[] = [
	'Penny',
	'Elliott',
	'Jodi',
	'Abigail',
	'Sandy',
	'Marnie',
	'Robin',
	'George',
]
const winterBirthdays: SDVCharacterName[] = [
	'Krobus',
	'Linus',
	'Caroline',
	'Sebastian',
	'Harvey',
	'Wizard',
	'Evelyn',
	'Leah',
	'Clint',
]

describe('Data Builder for Calendar', () => {
	let results: SDVCalendarData

	beforeAll(async () => {
		results = (await buildCalendar()) as SDVCalendarData
	})

	test('matches expected output', () => {
		const expectation: SDVCalendarData = {
			Spring: {
				image:
					'https://stardewcommunitywiki.com/mediawiki/images/6/6d/Calendar_Spring.png',
				days: expect.objectContaining(days),
				birthdays: springBirthdays,
				events: ['Egg Festival', 'Flower Dance'],
				wiki: getWikiUrl('Spring'),
			},
			Summer: {
				image:
					'https://stardewcommunitywiki.com/mediawiki/images/e/e6/Calendar_Summer.png',
				days: expect.objectContaining(days),
				birthdays: summerBirthdays,
				events: ['Luau', 'Dance of the Moonlight Jellies'],
				wiki: getWikiUrl('Summer'),
			},
			Fall: {
				image:
					'https://stardewcommunitywiki.com/mediawiki/images/c/cb/Calendar_Fall.png',
				days: expect.objectContaining(days),
				birthdays: fallBirthdays,
				events: ['Stardew Valley Fair', "Spirit's Eve"],
				wiki: getWikiUrl('Fall'),
			},
			Winter: {
				image:
					'https://stardewcommunitywiki.com/mediawiki/images/5/5e/Calendar_Winter.png',
				days: expect.objectContaining(days),
				birthdays: winterBirthdays,
				events: ['Festival of Ice', 'Night Market', 'Feast of the Winter Star'],
				wiki: getWikiUrl('Winter'),
			},
		}
		expect(results).toMatchObject(expectation)
	})
})
