import { Message } from 'discord.js'
import { CommandInfo, CommandoMessage } from 'discord.js-commando'
import { getWikiUrl, formatWikiTerm } from '@/utils'
import { GuntherClient, GuntherCommand } from '@/bot'

const COMMAND_NAME = 'wiki'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['w'],
	group: 'stardew',
	memberName: 'wiki',
	description: 'Fetch url to a Wiki article',
	details: '',
	examples: [
		`\`${COMMAND_NAME} fish\``,
		`\`${COMMAND_NAME} some random search term\``,
	],
	args: [
		{
			key: 'searchTerms',
			prompt: 'What term or Wiki page are you looking for?',
			type: 'string',
		},
	],
}

export default class WikiCommand extends GuntherCommand {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: { searchTerms: string }
	): Promise<Message> {
		const { searchTerms } = args
		const url = getWikiUrl(formatWikiTerm(searchTerms))
		const pageContent = await this.client.fetch(url)

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
