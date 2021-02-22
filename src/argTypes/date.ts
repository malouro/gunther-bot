import { ArgumentType } from 'discord.js-commando'
import { checkDate, getDate } from './common'
import { SDVCalendarDate } from '../../data/structure'
import { GuntherClient } from '../client'

export default class DateArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-date')
	}

	parse(val: string): SDVCalendarDate {
		const { day, season } = getDate(val)

		return { day, season }
	}

	validate(val: string): boolean {
		return checkDate(val)
	}
}
