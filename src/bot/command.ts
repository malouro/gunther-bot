import { Command } from 'discord.js-commando'
import GuntherClient from './client'

abstract class GuntherCommand extends Command {
	client: GuntherClient
}

export default GuntherCommand
