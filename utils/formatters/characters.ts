import { SDVCharacterName } from '../../data/structure'

/**
 * Returns a proper capitalized & formatted character name
 * @param name String of the character's name to format properly
 */
export function formatCharacterName(name: string): SDVCharacterName {
	return `${name.charAt(0).toLocaleUpperCase()}${name
		.slice(1)
		.toLocaleLowerCase()}`
}
