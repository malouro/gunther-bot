import { CommandoClient } from 'discord.js-commando'
import dotenv from 'dotenv'
import fetch, { FetchInterface } from 'make-fetch-happen'
import path from 'path'
import { PathLike } from 'fs'
import { Logger } from 'winston'
import GuntherLogger from './logger'

dotenv.config()

const cacheManager = path.resolve(process.cwd(), './.cache')
const fetcher = fetch.defaults({
	cacheManager: cacheManager,
	cache: 'default',
})

export default class GuntherClient extends CommandoClient {
	logger: Logger = GuntherLogger()
	cacheManager: string | PathLike = cacheManager
	fetch: FetchInterface = fetcher
}
