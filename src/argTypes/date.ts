import { ArgumentType, CommandoClient } from 'discord.js-commando'
import {
	daysOfSeason,
	SDVCalendarDate,
	Season,
	seasons,
	seasonShorthands,
} from '../../data/structure'

export default class DateArgType extends ArgumentType {
	constructor(client: CommandoClient) {
		super(client, 'sdv-date')
	}

	parse(val: string): SDVCalendarDate | Season {
		let season = [...seasons, ...seasonShorthands].find(possibleSeason =>
			val.toLocaleLowerCase().startsWith(possibleSeason.toLocaleLowerCase())
		)
		let inferredDay = val
			.toLocaleLowerCase()
			.replace(season.toLocaleLowerCase(), '')
			.trim()

		if (/\s+/.test(inferredDay)) {
			inferredDay = inferredDay.split(/\s+/)[0]
		}

		switch (season) {
			case 'sp':
				season = 'Spring'
				break
			case 'su':
				season = 'Summer'
				break
			case 'f':
			case 'fa':
				season = 'Fall'
				break
			case 'w':
			case 'wi':
				season = 'Winter'
				break
			default:
				break
		}

		const day = inferredDay && daysOfSeason[parseInt(inferredDay) - 1]

		if (!day) {
			return {
				season,
				day: null,
			}
		}

		return {
			season,
			day,
		}
	}

	validate(
		val: string | typeof seasons[number] | typeof seasonShorthands[number]
	): boolean {
		return (
			seasons.some(season =>
				val.toLocaleLowerCase().startsWith(season.toLocaleLowerCase())
			) ||
			seasonShorthands.some(shorthand =>
				val.toLocaleLowerCase().startsWith(shorthand)
			)
		)
	}
}
