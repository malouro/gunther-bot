import { Message } from 'discord.js'
import { getWikiUrl, formatWikiTerm } from '@/utils'
import { GuntherCommand } from '@/bot'
import { Command } from '@sapphire/framework'

export const COMMAND_NAME = 'wiki'

export default class WikiCommand extends GuntherCommand {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			name: COMMAND_NAME,
			aliases: ['w'],
			description: 'Fetch URL to a related Wiki page.',
			detailedDescription: [
				`\`${COMMAND_NAME} fish\``,
				`\`${COMMAND_NAME} some random search term\``,
			].join('\n'),
		})
	}

	public async messageRun(message: Message): Promise<Message> {
		const [, ...searchTerms] = message.content.split(/\s+/)
		const url = getWikiUrl(formatWikiTerm(searchTerms.join()))
		const pageContent = await fetch(url)

		if (
			(await pageContent.text()).includes(
				'There is currently no text in this page.'
			)
		) {
			return message.reply(`Page does not exist for \`${searchTerms}\``)
		}

		return message.reply(url)
	}
}
