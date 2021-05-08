import { SDVCharacterName } from '../../../data/structure'
import { capitalize } from './common'

/**
 * Returns a proper capitalized & formatted character name
 * @param name String of the character's name to format properly
 */
export function formatCharacterName(name: string): SDVCharacterName | string {
	return capitalize(name)
}
