import assert from 'assert'
import { formatCharacterName, getWikiUrl, getImageUrl, baseWikiUrl } from '.'

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
