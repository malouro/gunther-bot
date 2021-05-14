import { seasons, seasonShorthands } from '../../../data/structure'
import getDate from './getDate'

/**
 * Checks that input was a valid SDV date.
 *
 * A valid SDV date starts with the full string for any season name,
 * or season shorthand name, and optionally includes a number value
 * from [1-28]. (ie: "summer 5")
 *
 * @param val Some user inputted string to check if is a date
 * @returns {boolean} Whether the input was a valid SDV date or not.
 */
export default function checkDate(
	val: string | typeof seasons[number] | typeof seasonShorthands[number]
): boolean {
	const { season } = getDate(val)

	return Boolean(season)
}
