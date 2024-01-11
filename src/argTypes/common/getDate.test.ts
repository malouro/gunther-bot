import getDate from './getDate'
import { SDVCalendarDate } from '../../../data/types'

const nullDate: SDVCalendarDate = { season: null, day: null }
const testCases: Array<[string, SDVCalendarDate]> = [
	['winter', { season: 'Winter', day: null }],
	['Winter', { season: 'Winter', day: null }],
	['WINTER', { season: 'Winter', day: null }],
	['winter 1', { season: 'Winter', day: '1' }],
	['wInTeR 2', { season: 'Winter', day: '2' }],
	['wInTeR 32', nullDate],
	['wiki', nullDate],
	['wi 0', nullDate],
	['wintery', nullDate],
]

describe.only('getDate', () => {
	test.each(testCases)('"%s" returns %o', (input, expectation) => {
		expect(getDate(input)).toMatchObject(expectation)
	})
})
