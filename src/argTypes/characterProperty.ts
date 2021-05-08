import { ArgumentType } from 'discord.js-commando'
import {
	characterDataFields,
	SDVCharacterData,
} from '../../data/structure'
import { GuntherClient, GuntherArgValue } from '../bot'

export default class CharacterInquiryArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character-prop')
	}

	parse(val: string): GuntherArgValue<string> {
		return { value: val.toLocaleLowerCase(), type: 'sdv-character-prop' }
	}

	validate(val: keyof SDVCharacterData): boolean {
		return Object.keys(characterDataFields).includes(val.toLocaleLowerCase())
	}
}
