import { ArgumentType } from 'discord.js-commando'
import { checkDate, getDate } from './common'
import { Season } from '../../data/structure'
import GuntherClient from '../client'

export default class SeasonArgType extends ArgumentType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-season')
	}

	parse(val: string): Season {
		const { season } = getDate(val)

		return season
	}

	validate(val: string): boolean {
		return checkDate(val) && getDate(val).day === null
	}
}
