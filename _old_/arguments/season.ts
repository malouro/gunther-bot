import { ArgumentType } from 'discord.js-commando'
import { checkDate, getDate, GuntherArgValue } from '@/argTypes/common'
import { SDVCalendarDate, SDVSeason } from '@/data/types'
import { GuntherClient } from '@/bot'

export default class SeasonArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-season')
	}

	date: SDVCalendarDate = null

	parse(): GuntherArgValue<SDVSeason> {
		return {
			value: this.date.season,
			type: 'sdv-season',
		}
	}

	validate(val: string): boolean {
		this.date = getDate(val)
		return checkDate(val) && this.date.day === null
	}
}
