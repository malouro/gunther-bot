import { Client } from 'discord.js-commando'
import dotenv from 'dotenv'

dotenv.config()

const Gunther = new Client({
  owner: process.env.OWNER,
  commandPrefix: process.env.COMMAND_PREFIX,
})

Gunther.registry
  .registerGroups([
    ['info', 'Commands that fetch information'],
    ['meta', 'Commands related to the bot itself']
  ])
  .registerCommands([
    /* commands go here */
  ])

Gunther.login(process.env.TOKEN)
