import { capitalize } from '@/utils/formatters'

describe('Common Formatters', () => {
	describe('capitalize', () => {
		test('formats string with a leading upper-case character', () => {
			const expectation = 'Test'
			expect(capitalize('tEsT')).toBe(expectation)
			expect(capitalize('TEST')).toBe(expectation)
			expect(capitalize('test')).toBe(expectation)
		})
	})
})
