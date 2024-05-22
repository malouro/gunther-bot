import camelCase from 'lodash.camelcase'
import {
	characterDataFields,
	SDVCharacterData,
	SDVCharacterDataField,
} from '@/data/types'
import { GuntherArgValue, GuntherArgType } from '@/argTypes/common'
import { GuntherClient } from '@/bot'

export default class CharacterInquiryArgType extends GuntherArgType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character-prop')
	}

	parse(val: string): GuntherArgValue<SDVCharacterDataField> {
		const sanitizedVal = camelCase(val)

		return {
			value: characterDataFields.find(
				fieldName =>
					fieldName.toLocaleLowerCase() === sanitizedVal.toLocaleLowerCase()
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
