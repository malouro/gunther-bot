import camelCase from 'lodash.camelcase'
import {
	characterDataFields,
	SDVCharacterData,
	SDVCharacterDataField,
} from '../../data/structure'
import { GuntherArgValue, GuntherArgType } from './common'
import GuntherClient from '../bot/client'

export default class CharacterInquiryArgType extends GuntherArgType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character-prop')
	}

	parse(val: string): GuntherArgValue<SDVCharacterDataField> {
		return {
			value: camelCase(val) as SDVCharacterDataField,
			type: 'sdv-character-prop',
		}
	}

	validate(val: keyof SDVCharacterData): boolean {
		return characterDataFields.includes(camelCase(val) as SDVCharacterDataField)
	}
}
