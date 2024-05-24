import { DateArgument, SeasonArgument } from '@/args'
import { GuntherCommand } from '@/bot'
import { Calendar } from '@/data'
import {
	daysOfSeason,
	SDVCalendarSeason,
	SDVCharacterName,
	SDVDayOfSeason,
	SDVEvent,
	SDVSeason,
	seasons,
	seasonShorthands,
} from '@/data/types'
import { getUpcomingDays, getWeekday, makeList, messageEmojis } from '@/utils'
import type { Args, Command } from '@sapphire/framework'
import { EmbedBuilder, Message } from 'discord.js'

export const COMMAND_NAME = 'calendar'

export default class CalendarCommand extends GuntherCommand {
	private constructor(
		context: Command.LoaderContext,
		options: Command.Options
	) {
		super(context, {
			...options,
			name: COMMAND_NAME,
			aliases: ['cal'],
			description:
				'Fetches information from the Stardew Valley event calendar.',
			detailedDescription: [
				'This can return back information related to either a specific day, or a specific season. ',
				'This includes upcoming birthdays and events.\n\n',
				`Seasons include: ${seasons
					.map(season => '`' + season + '`')
					.join(',')}\n`,
				`And their shorthand aliases: ${seasonShorthands
					.map(season => '`' + season + '`')
					.join(',')}`,
			]
				.join('')
				.concat(
					`\`${COMMAND_NAME} ${seasons[0]} ${daysOfSeason[15]}\`\n`,
					`\`${COMMAND_NAME} ${seasonShorthands[0]} ${daysOfSeason[15]}\`\n`,
					`\`${COMMAND_NAME} ${seasons[1]}\`\n`
				),
		})
	}

	private buildEmbedForDate(
		embed: EmbedBuilder,
		calendarSeason: SDVCalendarSeason,
		season: SDVSeason,
		day: SDVDayOfSeason
	) {
		const weekday = getWeekday(day)
		const events: Array<SDVEvent> = calendarSeason.days[day].events
		const birthdays: Array<SDVCharacterName> = calendarSeason.days[day]
			.birthdays as SDVCharacterName[]
		const upcomingDays = getUpcomingDays(season, day, 7)
		const upcomingDetails = upcomingDays
			.map(
				day =>
					`${
						/* If date is in new season, add a title header */
						day.date.season !== season && day.date.day === '1'
							? `--- **${day.date.season}** ---\n`
							: ''
					}**${day.date.day}**: ${
						/* Display events */
						day.events.length > 0
							? day.events
									.map(calEvent => `${messageEmojis.event} ${calEvent}`)
									.join(' ')
									.concat(' ')
							: ''
					}${
						/* Display birthdays */
						day.birthdays.length > 0
							? day.birthdays
									.map(birthday => `${messageEmojis.birthday} ${birthday}`)
									.join(' ')
							: ''
					}`
			)
			.join('\n')

		embed
			.setTitle(`${season} ${day}`)
			.setURL(calendarSeason.wiki)
			.setDescription(
				`Overview for **${season} ${day}**. This is a **${weekday}**.`
			)
			.addFields(
				{
					name: 'Events',
					value: events.length > 0 ? events.join('\n') : 'No events',
				},
				{
					name: 'Birthdays',
					value: birthdays.length > 0 ? birthdays.join('\n') : 'No birthdays',
				},
				{
					name: 'Upcoming',
					value: upcomingDetails,
				}
			)
	}

	private buildEmbedForSeason(
		embed: EmbedBuilder,
		calendarSeason: SDVCalendarSeason,
		season: SDVSeason
	) {
		embed
			.setTitle(season)
			.setURL(calendarSeason.wiki)
			.setDescription(`Overview for the ${season} season`)
			.addFields(
				{
					name: 'Events this season',
					value: makeList(calendarSeason.events),
				},
				{
					name: 'Birthdays this season',
					value: makeList(calendarSeason.birthdays),
				}
			)
			.setImage(calendarSeason.image)
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		type CalendarCommandInquiryTypes = 'SDV_CalendarDate' | 'SDV_Season'
		let day: SDVDayOfSeason | null
		let season: SDVSeason | null
		let inquiryType: CalendarCommandInquiryTypes

		try {
			;({ day, season } = await args.pick(DateArgument))
			inquiryType = 'SDV_CalendarDate'
		} catch (error) {
			try {
				season = await args.pick(SeasonArgument)
				inquiryType = 'SDV_Season'
			} catch (error) {
				return message.channel.send(
					'Please specify a valid calendar date or season.'
				)
			}
		}

		const embed = new EmbedBuilder()
		const calendarSeason: SDVCalendarSeason = Calendar[
			season
		] as SDVCalendarSeason

		// Build the embed with the given builder method.
		// This will mutate the value of embed
		switch (inquiryType) {
			case 'SDV_CalendarDate':
				this.buildEmbedForDate(embed, calendarSeason, season, day)
				break
			case 'SDV_Season':
				this.buildEmbedForSeason(embed, calendarSeason, season)
				break
		}

		return message.reply({ embeds: [embed] })
	}
}
