import GuntherClient from './client'
import commands, { groups } from '../commands'
import argTypes from '../argTypes'
import * as events from '../events'

const GuntherBot = new GuntherClient({
	owner: process.env.OWNER?.split(',') || 'NO_OWNER',
	commandPrefix: process.env.COMMAND_PREFIX || '!',
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
