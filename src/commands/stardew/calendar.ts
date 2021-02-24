import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import {
	Event,
	SDVCharacterName,
	SDVCalendarDate,
	SDVCalendarDay,
	Season,
	DayOfSeason,
	seasons,
	seasonShorthands,
	daysOfSeason,
} from '../../../data/structure'
import { Calendar } from '../../../data'
import { messageEmojis, getWeekday, getNextSeason } from '../../../utils'
import { GuntherClient } from '../../bot/client'

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
			prompt: 'What date on the calendar are you curious about?',
			type: 'sdv-season|sdv-date',
		},
	],
}

function getUpcomingDays(
	season: Season,
	currentDay: DayOfSeason,
	nextXDays = 5
): Array<SDVCalendarDay> {
	const calendarSeason = Calendar[season]
	const upcomingDays = []

	for (let x = 1; x <= nextXDays; x++) {
		const currentDayNumber = Number(currentDay)
		let nextDayToPush = currentDayNumber + x
		let currentSeason = calendarSeason

		if (nextDayToPush > 28) {
			nextDayToPush = nextDayToPush % 28
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
		args: { dateOrSeason: SDVCalendarDate | Season }
	): Promise<Message> {
		let day: DayOfSeason, season: Season

		if (typeof args.dateOrSeason === 'string') {
			day = null
			season = args.dateOrSeason
		} else {
			day = args.dateOrSeason.day
			season = args.dateOrSeason.season
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
			const events: Array<Event> = calendarSeason.days[day].events
			const birthdays: Array<SDVCharacterName> = calendarSeason.days[day].birthdays
			const upcomingDays = getUpcomingDays(season, day, 5)
			let upcomingNewSeasonFlag = false

			const upcomingDetails = upcomingDays.map(
				day => `${
					day.date.season !== season && !upcomingNewSeasonFlag && (() => {
						upcomingNewSeasonFlag = true
						return `--- **${day.date.season}** ---\n`
					})() || ''
				}**${day.date.day}**: ${
					day.events.length > 0
						? day.events.map(calEvent => `${messageEmojis.event} ${calEvent}`).join(' ').concat(' ')
						: ''
				}${
					day.birthdays.length > 0
						? day.birthdays.map(birthday => `${messageEmojis.birthday} ${birthday}`).join(' ')
						: ''
				}`
			).join('\n')

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
						value: upcomingDetails
					}
				)
		}

		return message.reply(embed)
	}
}
