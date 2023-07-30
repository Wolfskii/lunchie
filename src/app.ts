import express, { Request, Response } from 'express'
import path from 'path'
import { postTodaysMenuToDiscord, postTomorrowsMenuToDiscord, postWeeklyMenuToDiscord } from './discord/utils/menu'
import { scrapeVillageMenu } from './utils/menuScraper'
import { Client, GatewayIntentBits } from 'discord.js'
import { DiscordBot } from './discord/bot'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
!process.env.NODE_ENV ? (process.env.NODE_ENV = 'development') : null
console.clear()

// Start the Discord bot
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] })
const discordBot = new DiscordBot(discordClient, process.env.DISCORD_TOKEN!)
discordBot.start()

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  const ip = req.ip

  // Determine the path to package.json based on the environment
  const packageJsonPath = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, 'package.json') : path.resolve(__dirname, '..', 'package.json')

  // Retrieve package.json data
  const packageJson = require(packageJsonPath)

  const response = {
    port,
    ip,
    description: packageJson.description,
    version: packageJson.version,
    creator: packageJson.author,
    repository: packageJson.repository.url,
    environment: process.env.NODE_ENV,
    links: {
      self: { href: '/', method: 'GET', desc: 'Root-URL of the Lunch-Scraper Rest-API' },
      village: { href: '/village', method: 'GET', desc: 'This weeks daily lunch choices from the restaurant Village at CityGate, in Gårda, Gothenburg' },
      discordToday: { href: '/discord-today', method: 'GET', desc: 'Manually post the daily menu choices to Discord' },
      discordTomorrow: { href: '/discord-tomorrow', method: 'GET', desc: `Manually post tomorrow's menu choices to Discord` },
      discordWeek: { href: '/discord-week', method: 'GET', desc: `Manually post this week's menu choices to Discord` }
    }
  }

  res.json(response)
})

// Village endpoint
app.get('/village', async (req: Request, res: Response) => {
  try {
    const menu = await scrapeVillageMenu()
    res.json(menu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Post today's menu choices to Discord endpoint
app.get('/discord-today', async (req: Request, res: Response) => {
  try {
    await postTodaysMenuToDiscord(discordClient)
    res.json({ message: `Today's menu-choices posted to Discord` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Post tomorrow's menu choices to Discord endpoint
app.get('/discord-tomorrow', async (req: Request, res: Response) => {
  try {
    await postTomorrowsMenuToDiscord(discordClient)
    res.json({ message: `Tomorrow's menu-choices posted to Discord` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Post this week's menu choices to Discord endpoint
app.get('/discord-week', async (req: Request, res: Response) => {
  try {
    await postWeeklyMenuToDiscord(discordClient)
    res.json({ message: `This week's menu-choices posted to Discord` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

app.listen(port, () => {
  console.clear()
  console.log(`Server is running on http://localhost:${port}`)
})
