import { getDayOfSeason, getWeekday } from '../'
import {
	daysOfSeason,
	daysOfWeek,
	daysInAWeek,
	daysInASeason,
	SDVDayOfSeason,
} from '../../../data/types'

describe('Calendar Getters', () => {
	describe('getDayOfSeason', () => {
		test('should return day of season based on week# and dayOfWeek#', () => {
			const result: SDVDayOfSeason[] = []

			for (let week = 0; week < daysInASeason / daysInAWeek; week++) {
				for (let dayOfWeek = 0; dayOfWeek < daysInAWeek; dayOfWeek++) {
					result.push(
						(getDayOfSeason(week, dayOfWeek) + 1).toString() as SDVDayOfSeason
					)
				}
			}

			expect(result).toStrictEqual(daysOfSeason)
		})

		test('should only return a value from 0-27', () => {
			expect(getDayOfSeason(0, 0)).toBe(0)
			expect(getDayOfSeason(3, 6)).toBe(daysInASeason - 1)

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

				expect(result).toBe(daysOfWeek[(Number(day) - 1) % daysInAWeek])
			}
		)
	})
})
