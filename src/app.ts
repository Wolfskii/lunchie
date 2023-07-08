import express, { Request, Response } from 'express'
import path from 'path'
import { startDiscordBot, postMenuToDiscord } from './discord/bot'
import { scrapeMenu } from './menuScraper'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
!process.env.NODE_ENV ? (process.env.NODE_ENV = 'development') : null

// Start the Discord bot and store the client instance
const discordClient = startDiscordBot()

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
      postMenu: { href: '/discord-daily', method: 'GET', desc: 'Manually post the daily menu choices to Discord' }
    }
  }

  res.json(response)
})

// Village endpoint
app.get('/village', async (req: Request, res: Response) => {
  try {
    const menu = await scrapeMenu()
    res.json(menu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Post to Discord menu endpoint
app.get('/discord-daily', async (req: Request, res: Response) => {
  try {
    postMenuToDiscord(discordClient)
    res.json({ message: 'Menu posted to Discord' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

app.listen(port, () => {
  console.clear()
  console.log(`Server is running on http://localhost:${port}`)
})
