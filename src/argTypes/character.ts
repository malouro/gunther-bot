import { ArgumentType, CommandoClient } from 'discord.js-commando'
import { Characters } from '../../data'
import { SDVCharacterData, SDVCharacterName, SDVCharacterList } from '../../data/structs'
import { formatCharacterName } from '../../utils'

export default class CharacterArgType extends ArgumentType {
	constructor(client: CommandoClient) {
		super(client, 'sdv-character')
	}

	parse(val: string): SDVCharacterData {
		return Characters[formatCharacterName(val)]
	}

	validate(val: SDVCharacterName): boolean {
		return SDVCharacterList.includes(formatCharacterName(val))
	}
}
