import { Message, MessageEmbed } from 'discord.js'
import { CommandInfo, CommandoMessage } from 'discord.js-commando'
import {
	SDVCharacterData,
	SDVCalendarDate,
	SDVGiftTypes,
	giftTypes,
	SDVCharacterDataField,
	characterDataFields,
} from '@/data/types'
import { GuntherClient, GuntherCommand } from '@/bot'
import { GuntherArgValue } from '@/argTypes/common'
import { capitalize, formatWikiTerm } from '@/utils'

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
		'\n\nPossible `[inquiry]` options include:\n',
		`${giftTypes
			.map(giftType => `• \`${giftType}(s)\``)
			.concat(characterDataFields.map(dataField => `• \`${dataField}\``))
			.join('\n')}\n...or a \`calendar date\``,
	].join(''),
	examples: [
		`\`${COMMAND_NAME} abigail\` => general info on Abigail`,
		`\`${COMMAND_NAME} lewis hates\` => gifts that Lewis hates`,
		`\`${COMMAND_NAME} shane summer 13\` => where is Shane on Su. 13?`,
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
			type: 'sdv-gift-type|sdv-character-prop|sdv-date',
			label: '`[inquiry]`',
			default: { value: null, type: null },
		},
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

	getSpecificCharacterInfo(
		characterInfo: SDVCharacterData,
		dataField: SDVCharacterDataField
	): MessageEmbed {
		const specificInfo = characterInfo[dataField]
		const { name: characterName, avatar, wiki } = characterInfo

		const embed = new MessageEmbed()
			.setTitle(characterName)
			.setURL(`${wiki}#${formatWikiTerm(dataField)}`)
			.setThumbnail(avatar)
			.setDescription(`Specific info on ${characterName}`)

		switch (dataField) {
			case 'bestGifts':
				embed.addField('Best Gifts', Array(specificInfo).join('\n'))
				break
			case 'gifts':
				embed.addField(
					'Gifts',
					Object.entries(specificInfo).map(
						([key, value]) => `**${capitalize(key)}**:\n${value.join('\n')}\n`
					)
				)
				break
			case 'canMarry':
				embed.addField('Can marry?', specificInfo === true ? 'Yes' : 'No')
				break
			case 'avatar':
			case 'name':
			case 'wiki':
			case 'birthday':
			default:
				embed.addField(capitalize(dataField), specificInfo)
				break
		}

		return embed
	}

	getCharacterScheduleInfo(
		{ name: characterName, avatar, wiki }: SDVCharacterData,
		date: SDVCalendarDate
	): MessageEmbed {
		return new MessageEmbed()
			.setTitle(characterName)
			.setURL(`${wiki}#Schedule`)
			.setThumbnail(avatar)
			.addField(
				`Date of ${date.season} ${date.day}`,
				'This is where the schedule info would go.'
			)
	}

	getCharacterGiftInfo(
		{ name: characterName, wiki, avatar, gifts }: SDVCharacterData,
		giftType: SDVGiftTypes
	): MessageEmbed {
		return new MessageEmbed()
			.setTitle(characterName)
			.setURL(
				`${wiki}#${formatWikiTerm(
					giftType !== 'neutral' ? `${giftType}s` : giftType
				)}`
			)
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
			character: GuntherArgValue<SDVCharacterData>
			inquiry: GuntherArgValue<
				SDVCalendarDate | SDVGiftTypes | SDVCharacterDataField
			>
		}
	): Promise<Message> {
		const {
			character: { value: character },
			inquiry,
		} = args
		let info = null

		switch (inquiry.type) {
			case 'sdv-date':
				info = inquiry.value as SDVCalendarDate
				return message.reply(this.getCharacterScheduleInfo(character, info))
			case 'sdv-gift-type':
				info = inquiry.value as SDVGiftTypes
				return message.reply(this.getCharacterGiftInfo(character, info))
			case 'sdv-character-prop':
				info = inquiry.value as SDVCharacterDataField
				return message.reply(this.getSpecificCharacterInfo(character, info))
			default:
				return message.reply(this.getGeneralCharacterInfo(character))
		}
	}
}
