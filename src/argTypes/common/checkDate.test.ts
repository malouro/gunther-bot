import checkDate from './checkDate'
import { seasons, seasonShorthands } from '../../../data/types'

const testCases: Array<[string, boolean]> = [
	['winter', true],
	['WINTER', true],
	['winter 1', true],
	['wInTeR 2', true],
	['winter3', true],
	['wi', true],
	['WI', true],
	['wi 1', true],
	['wi2', true],
	['wiki', false],
	['wiki 17', false],
	['wintery', false],
	['wintery 27', false],
	['winter 0', false],
	['winter 29', false],
	['wi0', false],
	['WI 30', false],
]

describe('checkDate', () => {
	test.each([].concat(seasons).concat(seasonShorthands))(
		'"%s" returns true',
		season => {
			expect(checkDate(season)).toBe(true)
		}
	)

	test.each(testCases)('"%s" returns %p', (input, expectation) => {
		expect(checkDate(input)).toBe(expectation)
	})
})
