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
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerTypes(argTypes)
	.registerGroups(groups)
	.registerCommands(commands)

Gunther.on('ready', () => events.ready(Gunther))

Gunther.login(process.env.TOKEN)
