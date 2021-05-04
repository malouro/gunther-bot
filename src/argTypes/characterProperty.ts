import { ArgumentType } from 'discord.js-commando'
import {
	characterDataFields,
	SDVCharacterData,
	SDVGiftTypes,
} from '../../data/structure'
import { GuntherClient } from '../bot'
import { GuntherArgValue } from './common/types'

export default class CharacterInquiryArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character-prop')
	}

	sanitize(val: string): string {
		return val.toLocaleLowerCase().replace(/s$/,'')
	}

	parse(val: string): GuntherArgValue<SDVGiftTypes> {
		return { value: this.sanitize(val), type: 'sdv-gift-type' }
	}

	validate(val: keyof SDVCharacterData): boolean {
		return Object.keys(characterDataFields).includes(val)
	}
}
