import { formatCharacterName } from '@/utils/formatters'
import * as common from '@/utils/formatters/common'

describe('Character Formatters', () => {
	describe('formatCharacterName', () => {
		const spy = jest.spyOn(common, 'capitalize')

		test('should call `capitalize` func', () => {
			formatCharacterName('aBiGaIL')

			expect(spy).toHaveBeenCalled()
		})
	})
})
