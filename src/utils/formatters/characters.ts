import { SDVCharacterName } from '@/data/types'
import { capitalize } from '@/utils/formatters'

/**
 * Returns a proper capitalized & formatted character name
 * @param name String of the character's name to format properly
 */
export function formatCharacterName(name: string): SDVCharacterName {
	return capitalize(name) as SDVCharacterName
}
