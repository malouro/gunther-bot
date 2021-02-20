import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import {
	Event,
	SDVCharacterName,
	SDVCalendarDate,
	SDVCalendarSeason
} from '../../../data/structure'
import { Calendar } from '../../../data'
import { getWeekday } from '../../../utils'
import GuntherClient from '../../client'

const COMMAND_NAME = 'calendar-info'

export const info: CommandInfo = {
	name: COMMAND_NAME,
	aliases: ['calendar', 'cal'],
	group: 'stardew',
	memberName: 'calendar',
	description: 'Fetches info from the calendar',
	details: [
		'This can return back information related to either a specific day, or a specific season. ',
		'This includes upcoming birthdays and events.',
	].join(''),
	examples: [`\`${COMMAND_NAME} summer 15\``],
	args: [
		{
			key: 'date',
			prompt: 'What date on the calendar are you curious about?',
			type: 'sdv-date',
		},
	],
}

export default class CalendarCommand extends Command {
	constructor(client: GuntherClient) {
		super(client, info)
	}

	async run(
		message: CommandoMessage,
		args: { date: SDVCalendarDate }
	): Promise<Message> {
		const { day, season } = args.date
		const embed = new MessageEmbed()
		const calendarSeason: SDVCalendarSeason = Calendar[season]

		if (day === null) {
			embed
				.setTitle(season)
				.setURL(calendarSeason.wiki)
				.setDescription(`Overview for the ${season} season`)
				.addFields(
					{ name: 'Events this season', value: calendarSeason.events },
					{ name: 'Birthdays this season', value: calendarSeason.birthdays },
				)
				.setImage(calendarSeason.image)
		} else {
			const weekday = getWeekday(day)
			const events: Array<Event> = calendarSeason.days[day].events
			const birthdays: Array<SDVCharacterName> = calendarSeason.days[day].birthdays

			embed
				.setTitle(`${season} ${day}`)
				.setURL(calendarSeason.wiki)
				.setDescription(
					`Overview for **${season} ${day}**. This is a **${weekday}**.`
				)
				.addFields(
					{ name: 'Events', value: events.length > 0 ? events.join('\n') : 'No events' },
					{ name: 'Birthdays', value: birthdays.length > 0 ? birthdays.join('\n') : 'No birthdays' }
				)
		}

		return message.reply(embed)
	}
}
