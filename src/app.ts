import cors from 'cors'
import { Client, GatewayIntentBits } from 'discord.js'
import express from 'express'
import { DiscordBot } from './discord/bot'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
!process.env.NODE_ENV ? (process.env.NODE_ENV = 'development') : null

// Use the cors middleware and configure it
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: 'GET' // Allow GET requests
  })
)

console.log('Discord token:', process.env.DISCORD_TOKEN)

// Start the Discord bot
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] })

if (process.env.DISCORD_TOKEN) {
  const discordBot = new DiscordBot(discordClient, process.env.DISCORD_TOKEN!)
  discordBot.start()
} else {
  console.error('No Discord token provided')
}

// Routes import
import routes from './routes/index'
app.use('/', routes(discordClient))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
