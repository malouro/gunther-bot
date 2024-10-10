import { EmbedBuilder, Message } from 'discord.js'
import { GuntherCommand } from '@/bot'
import { Command } from '@sapphire/framework'

export default class HelpCommand extends GuntherCommand {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			name: 'help',
			description: 'Display the help menu.',
		})
	}

	public async messageRun(message: Message): Promise<Message> {
		const commands = this.container.stores.get('commands')
		const embeds: EmbedBuilder[] = []

		commands.forEach(command => {
			embeds.push(
				new EmbedBuilder()
					.setTitle(command.name)
					.setDescription(
						`**Summary:** ${
							command.description
						}\n\n**Aliases:** ${command.aliases
							.map(alias => `\`${alias}\``)
							.join(',')}\n\n ${command.detailedDescription}`
					)
			)
		})

		return message.reply({ embeds })
	}
}
