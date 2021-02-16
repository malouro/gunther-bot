import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import { SDVCharacterData } from '../../../data/structs'
import GuntherClient from '../../client'

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
	examples: [
		`\`${COMMAND_NAME} abigail\``
	],
	args: [
		{
			key: 'character',
			prompt: 'Which character would you like to fetch info on?',
			type: 'sdv-character'
		}
	]
}

export default class CharacterCommand extends Command {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: { character: SDVCharacterData }
	): Promise<Message> {
		const { name: characterName, avatar, birthday, bestGifts, canMarry, wiki } = args.character
		const embed = new MessageEmbed()
			.setTitle(characterName)
			.setURL(wiki)
			.setThumbnail(avatar)
			.setDescription(`Wiki information on ${characterName}`)
			.addField('Marriage?', `**${canMarry ? 'Yes' : 'No'}**`)
			.addField('Birthday', birthday)
			.addField('Best Gifts', bestGifts)

		return message.reply(embed)
	}
}
