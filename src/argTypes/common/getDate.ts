import {
	seasons,
	seasonShorthands,
	daysOfSeason,
	SDVCalendarDate,
	Season,
} from '../../../data/structure'

export default function checkDate(val: string): SDVCalendarDate {
	const parsedSeason = [...seasons, ...seasonShorthands].find(possibleSeason =>
		val.toLocaleLowerCase().startsWith(possibleSeason.toLocaleLowerCase())
	)

	let season: Season
	let inferredDay = val
		.toLocaleLowerCase()
		.replace(parsedSeason.toLocaleLowerCase(), '')
		.trim()

	if (/\s+/.test(inferredDay)) {
		inferredDay = inferredDay.split(/\s+/)[0]
	}

	switch (parsedSeason) {
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
			throw new Error('Shorthand for season not recognized')
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
