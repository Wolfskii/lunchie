import moment from 'moment'
import axios from 'axios'
import cheerio from 'cheerio'

const swedishWorkDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export async function getTodaysMenu(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find today's menu
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  const todayMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

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

export async function getTomorrowsMenu(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find tomorrow's menu
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  const tomorrowMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

  // If tomorrow's menu is found, post it to Discord
  if (tomorrowMenu) {
    let message = `Lunch-meny - ${tomorrow}\n\n`

    if (tomorrowMenu.choices.length > 0) {
      for (const choice of tomorrowMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }

    return message
  } else {
    console.log(`No menu found for ${tomorrow}`)
    return `Imorgon är det ${tomorrow} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }
}

export async function getWeeklyMenu(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Start by adding week and number as heading
  let message = `__**Vecka ${menu.weekNumber}:**__\n\n`

  // Add each day of the week
  menu.days.forEach((day: any) => {
    message += `*${day.name}:*\n`

    if (day.choices.length > 0) {
      // Add each daily choice to the current day
      day.choices.forEach((choice: any) => {
        message += `${choice}\n`
      })
    } else {
      // If no choice for the current day is found, print a '-'
      message += '-'
    }

    // New row to separate from last choice of previous day before new day is printed
    message += '\n'
  })

  return message
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
