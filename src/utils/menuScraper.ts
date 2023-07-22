import axios from 'axios'
import cheerio from 'cheerio'

const swedishWorkDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export async function getTodaysMenu(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find today's menu
  const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long' })
  const todayMenu = menu.days.find((day: any) => day.name.toLowerCase() === today.toLowerCase())

  // If today's menu is found, post it to Discord
  if (todayMenu) {
    let message = `Lunch-meny - ${today}\n\n`

    if (todayMenu.choices.length > 0) {
      for (const choice of todayMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }

    return message
  } else {
    console.log(`No menu found for ${today}`)
    return `Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }
}

export async function scrapeVillageMenu(): Promise<any> {
  const response = await axios.get('https://www.compass-group.se/village')
  const $ = cheerio.load(response.data)

  const menu: { weekNumber: string; days: { name: string; choices: string[] }[] } = { weekNumber: '', days: [] }
  let currentDay: { name: string; choices: string[] } | null = null

  $('.c-article__content').each((index: any, element: any) => {
    const menuText = $(element).text()

    const menuLines = menuText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')

    for (const line of menuLines) {
      if (line.startsWith('Lunchmeny vecka')) {
        menu.weekNumber = line.replace('Lunchmeny vecka', '').trim()
      } else if (swedishWorkDays.includes(line)) {
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
  })

  return menu
}
