import { ArgumentType } from 'discord.js-commando'
import { Characters } from '../../data'
import {
	SDVCharacterData,
	SDVCharacterName,
	SDVCharacterList,
} from '../../data/structure'
import { formatCharacterName } from '../utils'
import { GuntherClient } from '../bot'

export default class CharacterArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character')
	}

	parse(val: string): SDVCharacterData {
		return Characters[formatCharacterName(val)]
	}

	validate(val: SDVCharacterName): boolean {
		return SDVCharacterList.includes(formatCharacterName(val))
	}
}
