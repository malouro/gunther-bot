import { ArgumentType } from 'discord.js-commando'
import {
	SDVGiftTypes,
	giftTypes,
} from '../../data/structure'
import { GuntherClient } from '../bot'
import { GuntherArgValue } from './common/types'

export default class CharacterInquiryArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-gift-type')
	}

	sanitize(val: string): string {
		return val.toLocaleLowerCase().replace(/s$/,'')
	}

	parse(val: string): GuntherArgValue<SDVGiftTypes> {
		return { value: this.sanitize(val), type: 'sdv-gift-type' }
	}

	validate(val: SDVGiftTypes): boolean {
		return giftTypes.includes(this.sanitize(val))
	}
}
