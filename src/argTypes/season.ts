import { ArgumentType } from 'discord.js-commando'
import { checkDate, getDate, GuntherArgValue } from './common'
import { SDVSeason } from '../../data/structure'
import { GuntherClient } from '../bot'

export default class SeasonArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-season')
	}

	parse(val: string): GuntherArgValue<SDVSeason> {
		const { season } = getDate(val)

		return {
			value: season,
			type: 'sdv-season',
		}
	}

	validate(val: string): boolean {
		return checkDate(val) && getDate(val).day === null
	}
}
