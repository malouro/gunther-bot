import { CommandoClient } from 'discord.js-commando'
import Logger from './logger'

export default class GuntherClient extends CommandoClient {
	logger = Logger
}
