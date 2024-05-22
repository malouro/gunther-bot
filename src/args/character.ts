import { SDVCharacterList, SDVCharacterName } from '@/data/types'
import { formatCharacterName } from '@/utils'
import { Args } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'

export const CharacterArgument = Args.make<SDVCharacterName>(
	(parameter: string, { argument }) => {
		const formattedName: SDVCharacterName = formatCharacterName(
			parameter as SDVCharacterName
		)
		if (
			!isNullishOrEmpty(parameter) &&
			SDVCharacterList.includes(formattedName)
		) {
			return Args.ok(formattedName)
		}

		return Args.error({
			argument,
			parameter,
			identifier: 'SDV_Character',
			message: 'Provided argument was not a valid Stardew Valley character.',
		})
	}
)
