import dotenv from 'dotenv'
import fetch from 'make-fetch-happen'
import path from 'path'
import { CommandoClient } from 'discord.js-commando'
import GuntherLogger from './logger'

dotenv.config()

const cacheManager = path.resolve(process.cwd(), './.cache')
const fetcher = fetch.defaults({
	cacheManager: cacheManager,
	cache: 'default',
})

export default class GuntherClient extends CommandoClient {
	logger = GuntherLogger
	cacheManager = cacheManager
	fetch = fetcher
}
