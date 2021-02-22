import { Message } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import { repository } from '../../../package.json'
import GuntherClient from '../../client'

const COMMAND_NAME = 'git-repo'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['git', 'github', 'repo'],
	group: 'meta',
	memberName: 'git',
	description: "View the bot's source code",
	examples: [`\`${COMMAND_NAME}\``],
}

export default class GitCommand extends Command {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(message: CommandoMessage): Promise<Message> {
		return message.reply(`Check out my source code at: ${repository}`)
	}
}
