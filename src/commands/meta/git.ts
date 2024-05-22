import type { Message } from 'discord.js'
import { GuntherCommand } from '@/bot'
import { Command } from '@sapphire/framework'
import { repository } from '@root/package.json'

export default class GitCommand extends GuntherCommand {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			name: 'git-repo',
			aliases: ['git', 'github', 'repo'],
			description: "View the bot's source code",
		})
	}

	public async messageRun(message: Message): Promise<Message> {
		return message.reply(`Check out my source code at: ${repository}`)
	}
}
