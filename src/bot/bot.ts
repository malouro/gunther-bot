import GuntherClient from '@/bot/client'
import { ready } from '@/events'
import { GatewayIntentBits } from 'discord.js'
import path from 'node:path'

const GuntherBot = new GuntherClient({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
	loadMessageCommandListeners: true,
	defaultPrefix: process.env.COMMAND_PREFIX ?? '!',
	// baseUserDirectory: path.resolve(__dirname, '../'),
})

GuntherBot.on('ready', ready)

export default GuntherBot
