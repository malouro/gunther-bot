import { Message, MessageEmbed } from 'discord.js'
import { CommandInfo, CommandoMessage } from 'discord.js-commando'
import { SDVCharacterData, SDVCalendarDate, SDVGiftTypes, giftTypes } from '../../../data/structure'
import { GuntherArgValue } from '../../argTypes/common/types'
import { GuntherClient, GuntherCommand } from '../../bot'
import { capitalize } from '../../utils'

const COMMAND_NAME = 'character-info'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['character', 'char', 'npc', 'villager'],
	group: 'stardew',
	memberName: 'character',
	description: 'Fetches info on a character',
	details: [
		'Returns back information on the character. ',
		'This includes their birthday, favorite gifts, etc.',
		'\n\nPossible `[inquiry options]` include:\n',
		`${giftTypes.map((gifType) => `• \`${gifType}\``).join('\n')}\n...or a \`calendar date\``,
	].join(''),
	examples: [
		`\`${COMMAND_NAME} abigail\``,
		`\`${COMMAND_NAME} lewis hates\``,
		`\`${COMMAND_NAME} shane summer 13\``
	],
	args: [
		{
			key: 'character',
			prompt: 'Which character would you like to fetch info on?',
			type: 'sdv-character',
		},
		{
			key: 'inquiry',
			prompt: 'What particular information are you interested in?',
			type: 'sdv-gift-type|sdv-date',
			label: 'inquiry options',
			default: { value: null, type: null }
		}
	],
}

export default class CharacterCommand extends GuntherCommand {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	getGeneralCharacterInfo({
		name: characterName,
		avatar,
		birthday,
		bestGifts,
		canMarry,
		wiki,
	}: SDVCharacterData): MessageEmbed {
		return new MessageEmbed()
			.setTitle(characterName)
			.setURL(wiki)
			.setThumbnail(avatar)
			.setDescription(`Wiki information on ${characterName}`)
			.addField('Marriage?', `**${canMarry ? 'Yes' : 'No'}**`)
			.addField('Birthday', birthday)
			.addField('Best Gifts', bestGifts)
	}

	getCharacterScheduleInfo({
		name: characterName,
		avatar,
	}: SDVCharacterData): MessageEmbed {
		return new MessageEmbed()
			.setTitle(characterName)
			.setThumbnail(avatar)
			.addField('This is where the schedule info would go.', 'IF IT EXISTED!')
	}

	getCharacterGiftInfo({
		name: characterName,
		avatar,
		gifts
	}: SDVCharacterData,
		giftType: SDVGiftTypes
	): MessageEmbed {
		return new MessageEmbed()
			.setTitle(characterName)
			.setThumbnail(avatar)
			.addField(
				giftType !== 'neutral'
					? `${capitalize(giftType)}d Gifts`
					: 'Neutral Gifts',
				gifts[giftType].join('\n')
			)
	}

	async run(
		message: CommandoMessage,
		args: {
			character: SDVCharacterData,
			inquiry: GuntherArgValue<SDVCalendarDate|SDVGiftTypes>
		},
	): Promise<Message> {
		const { character, inquiry } = args

		switch (inquiry.type) {
			case 'sdv-date':
				return message.reply(this.getCharacterScheduleInfo(character))
			case 'sdv-gift-type':
				return message.reply(this.getCharacterGiftInfo(character, inquiry.value))
			default:
				return message.reply(this.getGeneralCharacterInfo(character))
		}
	}
}
