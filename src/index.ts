import { Client } from 'discord.js-commando'
import commands from './commands'
import argTypes from './argTypes'
import dotenv from 'dotenv'

dotenv.config()

const Gunther = new Client({
	owner: process.env.OWNER.split(','),
	commandPrefix: process.env.COMMAND_PREFIX,
})

Gunther.registry
	.registerDefaultTypes()
	.registerTypes(argTypes)
	.registerGroups([
		['stardew', 'Stardew Valley'],
		['meta', 'Meta-info']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommands(commands)

Gunther.login(process.env.TOKEN)
