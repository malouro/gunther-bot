import type { Message } from 'discord.js'
import { GuntherCommand } from '@/bot'
import { Command } from '@sapphire/framework'

export default class PingCommand extends GuntherCommand {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			name: 'ping',
			description: 'Are you there, Mr. Gunther-bot?',
		})
	}

	public async messageRun(message: Message): Promise<Message> {
		const msg = await message.channel.send('Ping?')

		const content = `Pong! (Bot Latency: \`${Math.round(
			this.container.client.ws.ping
		)} ms\`; API Latency: \`${
			msg.createdTimestamp - message.createdTimestamp
		} ms\`)`

		return msg.edit(content)
	}
}
