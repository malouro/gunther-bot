import {
	seasons,
	seasonShorthands,
	daysOfSeason,
	SDVCalendarDate,
	SDVSeason,
} from '../../../data/structure'

export default function checkDate(val: string): SDVCalendarDate {
	const parsedSeason = [...seasons, ...seasonShorthands].find(possibleSeason =>
		val.toLocaleLowerCase().startsWith(possibleSeason.toLocaleLowerCase())
	)

	let season: SDVSeason

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
			if (!seasons.includes(parsedSeason)) {
				console.error(`Parsed season detected: ${parsedSeason}`)

				return {
					season: null,
					day: null,
				}
			}
			season = parsedSeason
			break
	}

	let inferredDay = val
		.toLocaleLowerCase()
		.replace(parsedSeason.toLocaleLowerCase(), '')
		.trim()

	if (/\s+/.test(inferredDay)) {
		inferredDay = inferredDay.split(/\s+/)[0]
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
