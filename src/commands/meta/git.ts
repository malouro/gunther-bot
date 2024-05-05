import { Message } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import { GuntherClient, GuntherCommand } from '@/bot'

const COMMAND_NAME = 'git-repo'
const repository = 'https://github.com/malouro/gunther-bot.git'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['git', 'github', 'repo'],
	group: 'meta',
	memberName: 'git',
	description: "View the bot's source code",
	examples: [`\`${COMMAND_NAME}\``],
}

export default class GitCommand extends GuntherCommand {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(message: CommandoMessage): Promise<Message> {
		this.client.logger.log('info', 'HELLO')
		return message.reply(`Check out my source code at: ${repository}`)
	}
}
