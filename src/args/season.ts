import { SDVSeason } from '@/data/types'
import { checkDate, getDate } from '@/utils'
import { Args } from '@sapphire/framework'
import { isNullishOrEmpty, isNullish } from '@sapphire/utilities'

/**
 * Is the provided string "spring", "summer", "fall", or "winter".
 */
export const SeasonArgument = Args.make<SDVSeason>(
	(parameter: string, { argument }) => {
		if (!isNullishOrEmpty(parameter)) {
			const { day, season } = getDate(parameter)

			if (!isNullishOrEmpty(season) && isNullish(day) && checkDate(parameter)) {
				return Args.ok(season)
			}
		}

		return Args.error({
			argument,
			parameter,
			identifier: 'SDV_Season',
			message:
				'Provided argument was not a valid Stardew Valley calendar date.',
		})
	}
)
