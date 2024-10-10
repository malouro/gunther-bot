import { Args } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'
import { SDVGiftTypes, giftTypes } from '@/data/types'

/**
 * Is provided string "love", "like", "neutral", etc.
 */
export const GiftTypeArgument = Args.make<SDVGiftTypes>(
	(parameter: string, { argument }) => {
		if (!isNullishOrEmpty(parameter)) {
			if (giftTypes.includes(parameter)) {
				return Args.ok(parameter as SDVGiftTypes)
			}
		}

		return Args.error({
			argument,
			parameter,
			identifier: 'SDV_GiftType',
			message: 'Provided argument was not a valid Stardew Valley gift type.',
		})
	}
)
