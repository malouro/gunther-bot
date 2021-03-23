import { formatCharacterName } from '../'
import * as common from './common'

describe('Character Formatters', () => {
	describe('formatCharacterName', () => {
		const spy = jest.spyOn(common, 'capitalize')

		test('should call `capitalize` func', () => {
			formatCharacterName('aBiGaIL')

			expect(spy).toHaveBeenCalled()
		})
	})
})
