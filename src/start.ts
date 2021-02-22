import GuntherBot from './bot/client'
import dotenv from 'dotenv'

dotenv.config()

GuntherBot.login(process.env.TOKEN)
