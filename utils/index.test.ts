import {
	formatCharacterName,
	getWikiUrl,
	getImageUrl,
	baseWikiUrl,
	getDayOfSeason,
	getWeekday,
} from '.'
import { daysOfSeason, daysOfWeek } from '../data/structure'

describe('formatCharacterName', () => {
	test('should format character name w/ proper capitalization', () => {
		const Abigail = 'Abigail'

		expect(formatCharacterName('abigail')).toBe(Abigail)
		expect(formatCharacterName('aBiGaIL')).toBe(Abigail)
		expect(formatCharacterName('ABIGAIL')).toBe(Abigail)
	})
})

describe('getWikiUrl', () => {
	test('should return a Stardew Wiki URL', () => {
		expect(getWikiUrl('foo')).toMatch(baseWikiUrl)
	})
})

describe('getImageUrl', () => {
	test('should return a Stardew Wiki URL', () => {
		expect(getImageUrl('foo')).toMatch(baseWikiUrl)
	})

	test('should conditionally include "/" based on input', () => {
		expect(getImageUrl('/path/to/avatar').split('/')).toHaveLength(6)
		expect(getImageUrl('path/to/avatar').split('/')).toHaveLength(6)
	})
})

describe('getDayOfSeason', () => {
	test('should return day of season based on week# and dayOfWeek#', () => {
		const result = []

		for (let week = 0; week < 4; week++) {
			for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
				result.push((getDayOfSeason(week, dayOfWeek) + 1).toString())
			}
		}

		expect(result).toStrictEqual(daysOfSeason)
	})

	test('should only return a value from 0-27', () => {
		expect(getDayOfSeason(0, 0)).toBe(0)
		expect(getDayOfSeason(3, 6)).toBe(27)

		expect(() => getDayOfSeason(-1, 0)).toThrow(/between \[0-3\]/)
		expect(() => getDayOfSeason(4, 0)).toThrow(/between \[0-3\]/)

		expect(() => getDayOfSeason(0, -1)).toThrow(/between \[0-6\]/)
		expect(() => getDayOfSeason(0, 7)).toThrow(/between \[0-6\]/)
	})
})

describe('getWeekday', () => {
	test.each(daysOfSeason)(
		'returns correct weekday for day #%s of any Season',
		day => {
			const result = getWeekday(day)

			expect(result).toBe(daysOfWeek[(Number(day) - 1) % 7])
		}
	)
})
