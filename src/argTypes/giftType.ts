import { ArgumentType } from 'discord.js-commando'
import { SDVGiftTypes, giftTypes } from '../../data/types'
import { GuntherClient } from '../bot'
import { GuntherArgValue } from './common'

export default class CharacterInquiryArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-gift-type')
	}

	sanitize(val: string): string {
		return val.toLocaleLowerCase().replace(/s$/, '')
	}

	parse(val: SDVGiftTypes): GuntherArgValue<string> {
		return { value: this.sanitize(val), type: 'sdv-gift-type' }
	}

	validate(val: SDVGiftTypes): boolean {
		return giftTypes.includes(this.sanitize(val))
	}
}
