import { ArgumentType } from 'discord.js-commando'
import { checkDate, getDate } from './common'
import { SDVCalendarDate } from '../../data/structure'
import { GuntherClient } from '../bot'
import { GuntherArgValue } from './common/types'

export default class DateArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-date')
	}

	parse(val: string): GuntherArgValue<SDVCalendarDate> {
		const { day, season } = getDate(val)

		return {
			value: { day, season },
			type: 'sdv-date'
		}
	}

	validate(val: string): boolean {
		return checkDate(val)
	}
}
