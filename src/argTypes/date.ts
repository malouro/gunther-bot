import { ArgumentType, CommandoClient } from 'discord.js-commando'
import { daysOfSeason, SDVDate, Season, seasons, seasonShorthands } from '../../data/structs'

export default class DateArgType extends ArgumentType {
	constructor(client: CommandoClient) {
		super(client, 'sdv-date')
	}

	parse(val: string): SDVDate | Season {
		let season = [...seasons, ...seasonShorthands].find(possibleSeason => val.startsWith(possibleSeason))

		switch (season) {
			case 'sp':
				season ='Spring'
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

		const inferredDay = val.slice(val.indexOf(season) + season.length - 1, val.length)

		if (!inferredDay || !Number.isNaN(inferredDay)) {
			return season
		}

		const day = daysOfSeason[parseInt(inferredDay) - 1]

		return {
			season,
			day
		}
	}

	validate(val: string | typeof seasons[number] | typeof seasonShorthands[number]): boolean {
		return (
			seasons.some(season => val.startsWith(season)) ||
			seasonShorthands.some(shorthand => val.startsWith(shorthand))
		)
	}
}
