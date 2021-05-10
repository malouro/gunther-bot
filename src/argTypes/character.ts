import { Characters } from '../../data'
import { SDVCharacterName, SDVCharacterList } from '../../data/structure'
import { formatCharacterName } from '../utils'
import { GuntherClient } from '../bot'
import { GuntherArgType, GuntherArgValue } from './common'

export default class CharacterArgType extends GuntherArgType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-character')
	}

	parse(val: string): GuntherArgValue {
		return {
			value: Characters[formatCharacterName(val)],
			type: 'sdv-character',
		}
	}

	validate(val: SDVCharacterName): boolean {
		return SDVCharacterList.includes(formatCharacterName(val))
	}
}
