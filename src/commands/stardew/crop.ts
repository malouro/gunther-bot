import { CropArgument } from '@/args/crop'
import { GuntherCommand } from '@/bot'
import { Crops } from '@/data'
import { SDVCropList, SDVCropName } from '@/data/types'
import { makeList } from '@/utils'
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
		let crop: null | SDVCropName = null
		try {
			crop = await args.pick(CropArgument)
		} catch (error) {
			return message.reply(
				`Please specify a valid crop name:\n\n${makeList(
					SDVCropList as unknown as string[]
				)}`
			)
		}

		// TODO: Format this into something nice :)
		// TODO: Get crop image from data
		return message.reply(JSON.stringify(Crops[crop], null, 2))
	}
}
