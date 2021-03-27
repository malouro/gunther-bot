import dotenv from 'dotenv'
import { CommandoClient } from 'discord.js-commando'
import commands, { groups } from '../commands'
import argTypes from '../argTypes'
import * as events from '../events'
import GuntherLogger from './logger'

dotenv.config()

export class GuntherClient extends CommandoClient {
	logger = GuntherLogger
}

const GuntherBot = new GuntherClient({
	owner: process.env.OWNER?.split(','),
	commandPrefix: process.env.COMMAND_PREFIX,
})

GuntherBot.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerTypes(argTypes)
	.registerGroups(groups)
	.registerCommands(commands)

GuntherBot.on('ready', () => events.ready(GuntherBot))

export default GuntherBot
