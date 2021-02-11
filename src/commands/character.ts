import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { SDVCharacterData } from '../../data/structs'

const COMMAND_NAME = 'character-info'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['character', 'char', 'npc', 'villager'],
	group: 'stardew',
	memberName: 'character',
	description: 'Fetches info on a character',
	details: [
		'Returns back information on the character. ',
		'This includes their birthday, favorite gifts, etc.'
	].join(''),
	examples: [`${COMMAND_NAME} abigail`],
	args: [
		{
			key: 'character',
			prompt: 'Which character would you like to fetch info on?',
			type: 'sdv-character'
		}
	]
}

interface args {
	character: SDVCharacterData
}

export default class CharacterCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: args
	): Promise<Message> {
		const { name: characterName, avatar, birthday, bestGifts, wiki, canMarry } = args.character
		const embed = new MessageEmbed()
			.setTitle(characterName)
			.setURL(wiki)
			.setThumbnail(avatar)
			.setDescription(`Wiki information on ${characterName}`)
			.addField('Birthday', birthday)
			.addField('Best Gifts', bestGifts)

		return message.reply(embed)
	}
}
