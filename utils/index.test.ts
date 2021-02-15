import assert from 'assert'
import { formatCharacterName, getWikiUrl, getAvatarUrl, baseWikiUrl } from '.'

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

describe('getAvatarUrl', () => {
	it('should return a Stardew Wiki URL', () => {
		assert.ok(getAvatarUrl('foo').includes(baseWikiUrl))
	})

	it('should conditionally include "/" based on input', () => {
		assert.strictEqual(getAvatarUrl('/path/to/avatar').split('/').length, 6)
		assert.strictEqual(getAvatarUrl('path/to/avatar').split('/').length, 6)
	})
})
