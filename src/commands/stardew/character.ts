import { Message, EmbedBuilder } from 'discord.js'
import {
	giftTypes,
	characterDataFields,
	SDVCharacterList,
	SDVCharacterDataField,
	SDVCharacterData,
	SDVCharacterName,
	SDVCalendarDate,
	SDVGiftTypes,
} from '@/data/types'
import { Characters } from '@/data'
import { GuntherCommand } from '@/bot'
import { Args, Command } from '@sapphire/framework'
import { capitalize, formatWikiTerm, makeList } from '@/utils'
import { CharacterArgument, DateArgument } from '@/args'

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

	// !character <character>
	private getGeneralCharacterInfo({
		name: characterName,
		avatar,
		birthday,
		bestGifts,
		canMarry,
		wiki,
	}: SDVCharacterData): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(characterName)
			.setURL(wiki)
			.setThumbnail(avatar)
			.setDescription(`Wiki information on ${characterName}`)
			.addFields(
				{ name: 'Marriage?', value: `**${canMarry ? 'Yes' : 'No'}**` },
				{ name: 'Birthday', value: birthday },
				{ name: 'Best Gifts', value: makeList(bestGifts) },
				{
					name: 'More info?',
					value: `For more specific information try using any of the following inquiries:\n${makeList(
						characterDataFields
					)}`,
				}
			)
	}

	// !character <character> <specific-inquiry>
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

	private getCharacterScheduleInfo(
		{ name: characterName, avatar, wiki }: SDVCharacterData,
		date: SDVCalendarDate
	): EmbedBuilder {
		// Notes:
		// - Figure out the day of the week, which can be interpolated from the date.
		// - Figure out calendar day, check if there's an exception for that day/event going on.
		// - Use weather info to check for an exception schedule.
		//
		// It's possible that we can just build out the data set for each character's schedule
		// and then just reference that data set here.
		//
		// Character.schedule.[season].[day].[normal|rain] =>
		// [ { time: 6, desc: 'Doing stuff', location: 'Location' }, { ...} ]

		return new EmbedBuilder()
			.setTitle(characterName)
			.setURL(`${wiki}#Schedule`)
			.setThumbnail(avatar)
			.addFields({
				name: `Date of ${date.season} ${date.day}`,
				value: 'Work in progress. (This is where the schedule info would go)',
			})
	}

	private getGiftInfo(
		{ name: characterName, wiki, avatar, gifts }: SDVCharacterData,
		giftType: SDVGiftTypes
	): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(characterName)
			.setURL(
				`${wiki}#${formatWikiTerm(
					giftType !== 'neutral' ? `${giftType}s` : giftType
				)}`
			)
			.setThumbnail(avatar)
			.addFields({
				name:
					giftType !== 'neutral'
						? `${capitalize(giftType)}d Gifts`
						: 'Neutral Gifts',
				value: gifts[giftType].join('\n'),
			})
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let character: null | SDVCharacterName = null
		let inquiry: null | string | SDVCalendarDate = null
		let inquiryType: null | string

		try {
			character = await args.pick(CharacterArgument)
		} catch (error) {
			return message.reply(
				`Please specify a character to look up information on:\n\n${makeList(
					SDVCharacterList as unknown as string[]
				)}`
			)
		}

		try {
			inquiry = await args.pick(DateArgument)
			inquiryType = 'date'
		} catch (error) {
			try {
				inquiry = await args.pick('string')

				if (
					inquiry &&
					!characterDataFields.includes(
						inquiry as unknown as SDVCharacterDataField
					)
				) {
					return message.reply(
						`Please specify a category of information to look up for ${character} from the valid list of categories:\n\n${makeList(
							(characterDataFields as unknown as string[]).map(f => `\`${f}\``)
						)}`
					)
				} else {
					inquiryType = 'specific'
				}
			} catch (error) {
				inquiryType = 'general'
			}
		}

		let embed: null | EmbedBuilder = null

		switch (inquiryType) {
			case 'general':
				embed = this.getGeneralCharacterInfo(Characters[character])
				break
			case 'specific':
				embed = this.getSpecificCharacterInfo(
					Characters[character],
					inquiry as SDVCharacterDataField
				)
				break
			case 'date':
				embed = this.getCharacterScheduleInfo(
					Characters[character],
					inquiry as SDVCalendarDate
				)
				break
		}

		return message.reply({ embeds: [embed] })
	}
}
