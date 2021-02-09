import { Command, CommandInfo, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { Characters } from '../../data'

const COMMAND_NAME = 'character-info'

export const info: CommandInfo = {
  name: COMMAND_NAME,
  aliases: ['character', 'char', 'npc', 'villager'],
  group: 'info',
  memberName: 'character',
  description: 'Fetches info on a character',
  details: [
    'Returns back information on the character. ',
    'This includes their birthday, favorite gifts, etc.'
  ].join(''),
  examples: [
    `${COMMAND_NAME} abigail`
  ]
}

export default class CharacterCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, info)
  }

  async run(
    message: CommandoMessage,
    args: string
  ): Promise<CommandoMessage> {
    //
    return null
  }
}
