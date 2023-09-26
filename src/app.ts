import express, { Request, Response } from 'express'
import { scrapeVillageMenu } from './utils/menuScraper'
import { Client, GatewayIntentBits } from 'discord.js'
import cors from 'cors'
import { DiscordBot } from './discord/bot'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
!process.env.NODE_ENV ? (process.env.NODE_ENV = 'development') : null

// Use the cors middleware
app.use(cors())

// Start the Discord bot
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] })
const discordBot = new DiscordBot(discordClient, process.env.DISCORD_TOKEN!)
discordBot.start()

// Routes import
import routes from './routes/index'
app.use('/', routes(discordClient))

app.listen(port, () => {
  console.clear()
  console.log(`Server is running on http://localhost:${port}`)
})
