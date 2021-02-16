import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo, CommandoMessage } from 'discord.js-commando'
import { Calendar } from '../../../data'
import { Event, SDVCharacterName, SDVDate } from '../../../data/structs'
import { getWeekday, getWikiUrl } from '../../../utils'
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
		args: { date: SDVDate }
	): Promise<Message> {
		const { day, season } = args.date
		const embed = new MessageEmbed()
		const seasonUrl = getWikiUrl(season)

		if (day === null) {
			embed
				.setTitle(season)
				.setURL(seasonUrl)
				.setDescription(`Overview for the ${season} season`)
		} else {
			const weekday = getWeekday(day)
			const events: Array<Event> = Calendar[season][day].events
			const birthdays: Array<SDVCharacterName> = Calendar[season][day].birthdays

			embed
				.setTitle(`${season} ${day}`)
				.setURL(seasonUrl)
				.setDescription(
					`Overview for **${season} ${day}**. This is a **${weekday}**.`
				)
				.addField('Events', events.length > 0 ? events.join('\n') : 'No events')
				.addField(
					'Birthdays',
					birthdays.length > 0 ? birthdays.join('\n') : 'No birthdays'
				)
		}

		return message.reply(embed)
	}
}
