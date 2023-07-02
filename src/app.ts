import express, { Request, Response } from 'express'
import puppeteer from 'puppeteer'

const app = express()

app.get('/', async (req: Request, res: Response) => {
  try {
    const menu = await scrapeMenu()
    res.json(menu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

async function scrapeMenu() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.goto('https://www.compass-group.se/village')

    // Wait for the page navigation to complete
    await page.waitForNavigation()

    // Wait for the menu element to appear
    await page.waitForSelector('.c-article__content')

    // Extract the menu text
    const menuText = await page.$eval('.c-article__content', (element) => element.textContent || '')

    // Parse the menu text and extract the daily choices
    const menuLines = menuText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')

    const menu: { weekNumber: string; days: { name: string; choices: string[] }[] } = { weekNumber: '', days: [] }
    let currentDay: { name: string; choices: string[] } | null = null

    const swedishDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

    for (const line of menuLines) {
      if (line.startsWith('Lunchmeny vecka')) {
        menu.weekNumber = line.replace('Lunchmeny vecka', '').trim()
      } else if (swedishDays.includes(line)) {
        const dayName = line.trim()
        currentDay = { name: dayName, choices: [] }
        menu.days.push(currentDay)
      } else if (currentDay) {
        const isClosed = line.toLowerCase().includes('stängt') || line.toLowerCase().includes('stängd')
        if (isClosed) {
          currentDay.choices = ['Stängt']
          currentDay = null // Reset currentDay to prevent further choices from being added
        } else if (currentDay.choices.length < 3) {
          currentDay.choices.push(line)
        }
      }
    }

    await browser.close()

    return menu
  } catch (error) {
    console.error('Scraping error:', error)
    throw error
  }
}

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.clear()
  console.log(`Server is running on http://localhost:${port}`)
})
