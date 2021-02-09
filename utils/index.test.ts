import assert from 'assert'
import { formatCharacterName } from '.'

describe('formatCharacterName', () => {
  it('should format character name w/ proper capitalization', () => {
    const Abigail = 'Abigail'
    assert.strictEqual(formatCharacterName('abigail'), Abigail)
    assert.strictEqual(formatCharacterName('aBiGaIL'), Abigail)
    assert.strictEqual(formatCharacterName('ABIGAIL'), Abigail)
  })
})
