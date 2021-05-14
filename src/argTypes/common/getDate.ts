import {
	seasons,
	seasonShorthands,
	daysOfSeason,
	SDVCalendarDate,
	SDVSeason,
	daysInASeason,
} from '../../../data/structure'

const nullDate: SDVCalendarDate = {
	season: null,
	day: null
}

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
				return nullDate
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

	const dayAsNumber = parseInt(inferredDay)

	if (Number.isNaN(dayAsNumber) && inferredDay !== '') {
		return nullDate
	}

	const day = inferredDay && daysOfSeason[dayAsNumber - 1]

	if (dayAsNumber > daysInASeason || dayAsNumber <= 0) {
		return nullDate
	}
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
