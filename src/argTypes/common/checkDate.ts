import { seasons, seasonShorthands } from '../../../data/structure'

export default function checkDate(
	val: string |
	typeof seasons[number] |
	typeof seasonShorthands[number]
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
