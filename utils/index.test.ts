import assert from 'assert'
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
	it('should format character name w/ proper capitalization', () => {
		const Abigail = 'Abigail'
		assert.strictEqual(formatCharacterName('abigail'), Abigail)
		assert.strictEqual(formatCharacterName('aBiGaIL'), Abigail)
		assert.strictEqual(formatCharacterName('ABIGAIL'), Abigail)
	})
})

describe('getWikiUrl', () => {
	it('should return a Stardew Wiki URL', () => {
		assert.ok(getWikiUrl('foo').includes(baseWikiUrl))
	})
})

describe('getImageUrl', () => {
	it('should return a Stardew Wiki URL', () => {
		assert.ok(getImageUrl('foo').includes(baseWikiUrl))
	})

	it('should conditionally include "/" based on input', () => {
		assert.strictEqual(getImageUrl('/path/to/avatar').split('/').length, 6)
		assert.strictEqual(getImageUrl('path/to/avatar').split('/').length, 6)
	})
})

describe('getDayOfSeason', () => {
	it('should return day of season based on week# and dayOfWeek#', () => {
		const result = []

		for (let week = 0; week < 4; week++) {
			for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
				result.push((getDayOfSeason(week, dayOfWeek) + 1).toString())
			}
		}

		assert.deepStrictEqual(result, daysOfSeason)
	})

	it('should only return a value from 0-27', () => {
		assert.strictEqual(getDayOfSeason(0, 0), 0)
		assert.strictEqual(getDayOfSeason(3, 6), 27)

		assert.throws(() => getDayOfSeason(-1, 0), /between \[0-3\]/)
		assert.throws(() => getDayOfSeason(4, 0), /between \[0-3\]/)

		assert.throws(() => getDayOfSeason(0, -1), /between \[0-6\]/)
		assert.throws(() => getDayOfSeason(0, 7), /between \[0-6\]/)
	})
})

describe('getWeekday', () => {
	it('returns weekday based on input', () => {
		for (const day of daysOfSeason) {
			const result = getWeekday(day)

			assert.strictEqual(result, daysOfWeek[(Number(day) - 1) % 7])
		}
	})
})
