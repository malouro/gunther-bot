import { baseWikiUrl } from '../constants'
import { getImageUrl, getWikiUrl } from '../'

describe('URL Getters', () => {
	describe('getImageUrl', () => {
		test('should return a Stardew Wiki URL', () => {
			expect(getImageUrl('foo')).toMatch(baseWikiUrl)
		})

		test('should conditionally include "/" based on input', () => {
			expect(getImageUrl('/path/to/avatar').split('/')).toHaveLength(6)
			expect(getImageUrl('path/to/avatar').split('/')).toHaveLength(6)
		})
	})

	describe('getWikiUrl', () => {
		test('should return a Stardew Wiki URL', () => {
			expect(getWikiUrl('foo')).toMatch(baseWikiUrl)
		})
	})
})
