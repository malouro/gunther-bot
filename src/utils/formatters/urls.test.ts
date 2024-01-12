import { formatWikiTerm } from '@/utils/formatters/urls'

describe('URL Formatters', () => {
	test('formatWikiTerm', () => {
		expect(formatWikiTerm('dance of the moonlight jellies')).toBe(
			'Dance_Of_The_Moonlight_Jellies'
		)
	})
})
