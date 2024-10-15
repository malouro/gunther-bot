import { CropArgument } from '@/args/crop'
import { GuntherCommand } from '@/bot'
import { Crops } from '@/data'
import { SDVCrop, SDVCropList, SDVCropName } from '@/data/types'
import { formatPrice, makeList } from '@/utils'
import { Args, Command } from '@sapphire/framework'
import { Message } from 'discord.js'

export default class CropCommand extends GuntherCommand {
	private constructor(
		context: Command.LoaderContext,
		options: Command.Options
	) {
		super(context, {
			...options,
			name: 'crop',
			aliases: ['crops', 'cr'],
			description: 'Fetches information on a crop.',
			detailedDescription: [
				'Returns back information on the crop. ',
				'This includes the seasons it grows in, regrowth rate, etc.',
				// add a list of possible inquiries
			].join(''),
		})
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let cropName: null | SDVCropName = null
		try {
			cropName = await args.pick(CropArgument)
		} catch (error) {
			return message.reply(
				`Please specify a valid crop name:\n\n${makeList(
					SDVCropList as unknown as string[]
				)}`
			)
		}

		const crop: SDVCrop = Crops[cropName]

		return message.reply(
			[
				`# ${crop.name}`,
				`**Seasons**: \n${makeList(crop.seasons)}`,
				`**Sell Price**: ${formatPrice(crop.sellPrice)}`,
				`**Growth Time**: ${crop.growth} days`,
			]
				.concat(
					crop.regrow
						? ['**Regrows**: Yes', `**Regrowth Time**: ${crop.regrowDays} days`]
						: ['**Regrows**: No']
				)
				.join('\n')
		)
	}
}
