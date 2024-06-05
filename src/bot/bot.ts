import GuntherClient from '@/bot/client'
import { ready } from '@/events'
import { GatewayIntentBits } from 'discord.js'

const GuntherBot = new GuntherClient({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
	loadMessageCommandListeners: true,
	defaultPrefix: process.env.COMMAND_PREFIX ?? '!',
})

GuntherBot.on('ready', ready)

export default GuntherBot
