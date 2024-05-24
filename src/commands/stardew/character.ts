import { Message, EmbedBuilder } from 'discord.js'
import {
	giftTypes,
	characterDataFields,
	SDVCharacterList,
	SDVCharacterDataField,
	SDVCharacterData,
	SDVCharacterName,
} from '@/data/types'
import { Characters } from '@/data'
import { GuntherCommand } from '@/bot'
import { Args, Command } from '@sapphire/framework'
import { capitalize, formatWikiTerm, makeList } from '@/utils'
import { CharacterArgument } from '@/args'

export default class CharacterCommand extends GuntherCommand {
	private constructor(
		context: Command.LoaderContext,
		options: Command.Options
	) {
		super(context, {
			...options,
			name: 'character',
			aliases: ['c', 'char'],
			description: 'Fetches information on a character.',
			detailedDescription: [
				'Returns back information on the character. ',
				'This includes their birthday, favorite gifts, etc.',
				'\n\nPossible `[inquiry]` options include:\n',
				`${makeList(
					giftTypes
						.map(giftType => `\`${giftType}(s)\``)
						.concat(characterDataFields.map(dataField => `\`${dataField}\``))
				)}\n...or a \`calendar date\``,
			].join(''),
		})
	}

	private getSpecificCharacterInfo(
		characterInfo: SDVCharacterData,
		dataField: SDVCharacterDataField
	): EmbedBuilder {
		const specificInfo = characterInfo[dataField]
		const { name: characterName, avatar, wiki } = characterInfo

		const embed = new EmbedBuilder()
			.setTitle(characterName)
			.setURL(`${wiki}#${formatWikiTerm(dataField)}`)
			.setThumbnail(avatar)
			.setDescription(`Specific info on ${characterName}`)

		switch (dataField) {
			case 'bestGifts':
				embed.addFields({
					name: 'Best Gifts',
					value: Array(specificInfo).join('\n'),
				})
				break
			case 'gifts':
				embed.addFields({
					name: 'Gifts',
					value: Object.entries(specificInfo)
						.map(
							([key, value]: [string, string[]]) =>
								`**${capitalize(key)}**:\n${value.join('\n')}\n`
						)
						.join('\n'),
				})
				break
			case 'canMarry':
				embed.addFields({
					name: 'Can marry?',
					value: specificInfo === true ? 'Yes' : 'No',
				})
				break
			case 'avatar':
			case 'name':
			case 'wiki':
			case 'birthday':
			default:
				embed.addFields({
					name: capitalize(dataField),
					value: specificInfo.toString(),
				})
				break
		}

		return embed
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let character: null | SDVCharacterName = null
		let inquiry: null | string = null
		let inquiryType: string

		try {
			character = await args.pick(CharacterArgument)
		} catch (error) {
			return message.channel.send(
				`Please specify a character to look up information on:\n\n${makeList(
					SDVCharacterList as unknown as string[]
				)}`
			)
		}

		try {
			inquiry = await args.pick('string')

			if (
				inquiry &&
				!characterDataFields.includes(
					inquiry as unknown as SDVCharacterDataField
				)
			) {
				throw Error(
					`Invalid inquiry provided for ${this.constructor.name}: "${inquiry}"`
				)
			}
		} catch (error) {
			return message.channel.send(
				`Please specify a category of information to look up for ${character} from the valid list of categories:\n\n${makeList(
					(characterDataFields as unknown as string[]).map(f => `\`${f}\``)
				)}`
			)
		}

		let embed: null | EmbedBuilder = null

		switch (inquiryType) {
			default:
		}
		embed = this.getSpecificCharacterInfo(
			Characters[character],
			inquiry as SDVCharacterDataField
		)

		return message.channel.send({ embeds: [embed] })
	}
}
