import GuntherClient from './client'
import commands, { groups } from './commands'
import argTypes from './argTypes'
import * as events from './events'

import dotenv from 'dotenv'

dotenv.config()

const Gunther = new GuntherClient({
	owner: process.env.OWNER.split(','),
	commandPrefix: process.env.COMMAND_PREFIX,
})

Gunther.registry
	.registerDefaultTypes()
	.registerTypes(argTypes)
	.registerGroups(groups)
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommands(commands)

Gunther.on('ready', () => events.ready(Gunther))

Gunther.login(process.env.TOKEN)
