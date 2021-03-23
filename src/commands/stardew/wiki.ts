import { Message } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import { getWikiUrl } from '../../../utils'
import { formatWikiTerm } from '../../../utils/formatters'
import { GuntherClient } from '../../bot/client'

import fetch from 'node-fetch'

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

export default class WikiCommand extends Command {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: { searchTerms: string }
	): Promise<Message> {
		const { searchTerms } = args
		const url = getWikiUrl(formatWikiTerm(searchTerms))
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
