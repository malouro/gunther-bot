import { SDVCalendarDate } from '@/data/types'
import { getDate } from '@/utils'
import { Args } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'

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
