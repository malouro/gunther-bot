import { SDVCalendarDate } from '@/data/types'
import { getDate } from '@/utils'
import { Args } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'

/**
 * Valid Stardew Valley calendar date formats:
 *
 * Example, for `Winter 14`, all of the following are valid:
 * - `Winter 14`
 * - `wi14`
 * - `wi 14`
 * - `w14`
 * - `w 14`
 */
export const DateArgument = Args.make<SDVCalendarDate>(
	(parameter: string, { argument }) => {
		if (!isNullishOrEmpty(parameter)) {
			const { day, season } = getDate(parameter)

			if (!isNullishOrEmpty(day) && !isNullishOrEmpty(season)) {
				return Args.ok({ day, season })
			}
		}

		return Args.error({
			argument,
			parameter,
			identifier: 'SDV_CalendarDate',
			message:
				'Provided argument was not a valid Stardew Valley calendar date.',
		})
	}
)
