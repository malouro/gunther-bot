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
		const sanitizedVal = camelCase(val)

		return {
			value: characterDataFields.find(
				fieldName => fieldName.toLocaleLowerCase() === sanitizedVal.toLocaleLowerCase()
			),
			type: 'sdv-character-prop',
		}
	}

	validate(val: keyof SDVCharacterData): boolean {
		const lowerCaseFieldNames = characterDataFields.map(fieldName =>
			fieldName.toLocaleLowerCase()
		)

		return (
			lowerCaseFieldNames.includes(
				val.toLocaleLowerCase() as SDVCharacterDataField
			) ||
			lowerCaseFieldNames.includes(
				camelCase(val).toLocaleLowerCase() as SDVCharacterDataField
			)
		)
	}
}
