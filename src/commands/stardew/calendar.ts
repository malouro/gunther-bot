import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import {
	SDVEvent,
	SDVCharacterName,
	SDVCalendarDate,
	SDVCalendarDay,
	SDVSeason,
	SDVDayOfSeason,
	seasons,
	seasonShorthands,
	daysOfSeason,
	daysInAWeek,
	daysInASeason,
} from '../../../data/structure'
import { Calendar } from '../../../data'
import { messageEmojis, getWeekday, getNextSeason } from '../../utils'
import { GuntherClient, GuntherArgTypeKeys, GuntherArgValue } from '../../bot'

const COMMAND_NAME = 'calendar-info'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['calendar', 'cal'],
	group: 'stardew',
	memberName: 'calendar',
	description: 'Fetches info from the calendar',
	details: [
		'This can return back information related to either a specific day, or a specific season. ',
		'This includes upcoming birthdays and events.\n\n',
		`Seasons include: ${seasons.map(season => '`' + season + '`').join(',')}\n`,
		`And their shorthand aliases: ${seasonShorthands
			.map(season => '`' + season + '`')
			.join(',')}`,
	].join(''),
	examples: [
		`\`${COMMAND_NAME} ${seasons[0]} ${daysOfSeason[15]}\``,
		`\`${COMMAND_NAME} ${seasonShorthands[0]} ${daysOfSeason[15]}\``,
		`\`${COMMAND_NAME} ${seasons[1]}\``,
	],
	args: [
		{
			key: 'dateOrSeason',
			prompt: 'What date or season on the calendar are you curious about?',
			type: 'sdv-season|sdv-date',
		},
	],
}

function getUpcomingDays(
	season: SDVSeason,
	currentDay: SDVDayOfSeason,
	nextXDays = daysInAWeek
): Array<SDVCalendarDay> {
	const calendarSeason = Calendar[season]
	const upcomingDays = []

	for (let x = 1; x <= nextXDays; x++) {
		const currentDayNumber = Number(currentDay)
		let nextDayToPush = currentDayNumber + x
		let currentSeason = calendarSeason

		if (nextDayToPush > daysInASeason) {
			nextDayToPush = nextDayToPush % daysInASeason
			currentSeason = Calendar[getNextSeason(season)]
		}
		upcomingDays.push(currentSeason.days[nextDayToPush])
	}

	return upcomingDays
}

export default class CalendarCommand extends Command {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: { dateOrSeason: GuntherArgValue<SDVCalendarDate | SDVSeason> }
	): Promise<Message> {
		const {
			type,
		}: {
			type: GuntherArgTypeKeys
		} = args.dateOrSeason

		let value: SDVCalendarDate | SDVSeason,
			day: SDVDayOfSeason,
			season: SDVSeason

		if (type === 'sdv-season') {
			value = args.dateOrSeason.value as SDVSeason
			day = null
			season = value
		} else if (type === 'sdv-date') {
			value = args.dateOrSeason.value as SDVCalendarDate
			day = value.day
			season = value.season
		} else {
			throw new Error(`ArgType of ${type} is not valid for <dateOrSeason>.`)
		}

		const embed = new MessageEmbed()
		const calendarSeason = Calendar[season]

		if (day === null) {
			embed
				.setTitle(season)
				.setURL(calendarSeason.wiki)
				.setDescription(`Overview for the ${season} season`)
				.addFields(
					{ name: 'Events this season', value: calendarSeason.events },
					{ name: 'Birthdays this season', value: calendarSeason.birthdays }
				)
				.setImage(calendarSeason.image)
		} else {
			const weekday = getWeekday(day)
			const events: Array<SDVEvent> = calendarSeason.days[day].events
			const birthdays: Array<SDVCharacterName> =
				calendarSeason.days[day].birthdays
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

		return message.reply(embed)
	}
}
