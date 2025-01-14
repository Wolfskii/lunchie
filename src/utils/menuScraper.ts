import axios from 'axios'
import cheerio from 'cheerio'
import moment from 'moment'
import * as xml2js from 'xml2js'

const swedishWorkDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

interface Restaurant {
  name: string
  scrapeMenu: () => Promise<any>
}

const restaurants: Restaurant[] = [
  { name: 'The Village', scrapeMenu: scrapeVillageMenu },
  { name: 'Vällagat', scrapeMenu: scrapeVallagatMenu }
  // Add more restaurants here
]

export async function getTodaysCollectedMenuString(): Promise<string> {
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  let message = ''

  for (const restaurant of restaurants) {
    const menu = await restaurant.scrapeMenu()
    const todaysMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

    message += `**${restaurant.name}** (${today.charAt(0).toUpperCase() + today.slice(1)}):\n`

    if (todaysMenu) {
      if (todaysMenu.choices.length > 0) {
        todaysMenu.choices.forEach((choice: string) => {
          message += `- ${choice}\n`
        })
      } else {
        message += '- Ingen meny tillgänglig\n'
      }
    } else {
      message += `- Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!\n`
    }

    message += '\n'
  }

  return message
}

export async function getTomorrowsCollectedMenuString(): Promise<string> {
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  let message = ''

  for (const restaurant of restaurants) {
    const menu = await restaurant.scrapeMenu()
    const tomorrowsMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

    message += `**${restaurant.name}** (${tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1)}):\n`

    if (tomorrowsMenu) {
      if (tomorrowsMenu.choices.length > 0) {
        tomorrowsMenu.choices.forEach((choice: string) => {
          message += `- ${choice}\n`
        })
      } else {
        message += '- Ingen meny tillgänglig\n'
      }
    } else {
      message += `- Imorgon är det ${tomorrow} och det finns därför ingen meny tillgänglig. Trevlig helg!\n`
    }

    message += '\n'
  }

  return message
}

export async function getWeeklyCollectedMenuStrings(): Promise<string[]> {
  const menuStrings: string[] = []

  for (const restaurant of restaurants) {
    const menu = await restaurant.scrapeMenu()

    let menuString = `**${restaurant.name} - Vecka ${menu.weekNumber}**:\n`

    menu.days.forEach((day: any) => {
      menuString += `*${day.name}*\n`

      if (day.choices.length > 0) {
        menuString += day.choices.join('\n') + '\n'
      } else {
        menuString += '-\n'
      }
    })

    menuStrings.push(menuString)
  }

  return menuStrings
}

export async function getTodaysVillageMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find today's menu and add week-number and day in the object
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  const todaysMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

  todaysMenu.weekNumber = menu.weekNumber
  todaysMenu.day = today.charAt(0).toUpperCase() + today.slice(1)
  delete todaysMenu.name

  return todaysMenu
}

export async function getTodaysVillageMenuString(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find today's menu
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  const todaysMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

  // If today's menu is found
  if (todaysMenu) {
    let message = `Lunch-meny - ${today}\n\n`

    if (todaysMenu.choices.length > 0) {
      for (const choice of todaysMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }

    return message
  } else {
    return `Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }
}

export async function getTomorrowsVillageMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find tomorrow's menu and add week-number and day in the object
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  const tomorrowsMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

  if (tomorrowsMenu) {
    tomorrowsMenu.weekNumber = menu.weekNumber
    tomorrowsMenu.day = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1)
    delete tomorrowsMenu.name
  } else {
    return `Imorgon är det ${tomorrow} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }

  return tomorrowsMenu
}

export async function getTomorrowsVillageMenuString(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  // Find tomorrow's menu
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  const tomorrowsMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

  // If tomorrow's menu is found
  if (tomorrowsMenu) {
    let message = `Lunch-meny - ${tomorrow}\n\n`

    if (tomorrowsMenu.choices.length > 0) {
      for (const choice of tomorrowsMenu.choices) {
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

export async function getWeeklyVillageMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVillageMenu()

  return menu
}

export async function getWeeklyVillageMenuString(): Promise<string> {
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
  const response = await axios.get('https://www.compass-group.se/menuapi/feed/rss/current-week?costNumber=388371&language=sv')
  const xmlData = response.data

  const parser = new xml2js.Parser()
  const parsedData = await parser.parseStringPromise(xmlData)

  const menu: { weekNumber: string; days: { name: string; choices: string[] }[] } = { weekNumber: '', days: [] }

  const items = parsedData.rss.channel[0].item
  items.forEach((item: any) => {
    const dayName = item.title[0].split(',')[0].trim()
    const description = item.description[0]
    const $ = cheerio.load(description)
    const choices: string[] = []

    $('p').each((index, element) => {
      const choice = $(element).text().trim()
      if (choice) {
        choices.push(choice)
      }
    })

    menu.days.push({ name: dayName, choices })
  })

  return menu
}

export async function getTodaysVallagatMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

  // Find today's menu and add week-number and day in the object
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  const todaysMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

  todaysMenu.weekNumber = menu.weekNumber
  todaysMenu.day = today.charAt(0).toUpperCase() + today.slice(1)
  delete todaysMenu.name

  return todaysMenu
}

export async function getTodaysVallagatMenuString(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

  // Find today's menu
  const today = moment().locale('sv-SE').format('dddd').toLowerCase()
  const todaysMenu = menu.days.find((day: any) => day.name.toLowerCase() === today)

  // If today's menu is found
  if (todaysMenu) {
    let message = `Lunch-meny - ${today}\n\n`

    if (todaysMenu.choices.length > 0) {
      for (const choice of todaysMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }

    return message
  } else {
    return `Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }
}

export async function getTomorrowsVallagatMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

  // Find tomorrow's menu and add week-number and day in the object
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  const tomorrowsMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

  if (tomorrowsMenu) {
    tomorrowsMenu.weekNumber = menu.weekNumber
    tomorrowsMenu.day = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1)
    delete tomorrowsMenu.name
  } else {
    return `Imorgon är det ${tomorrow} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }

  return tomorrowsMenu
}

export async function getTomorrowsVallagatMenuString(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

  // Find tomorrow's menu
  const tomorrowDate = moment().add(1, 'days')
  const tomorrow = tomorrowDate.locale('sv-SE').format('dddd').toLowerCase()
  const tomorrowsMenu = menu.days.find((day: any) => day.name.toLowerCase() === tomorrow)

  // If tomorrow's menu is found
  if (tomorrowsMenu) {
    let message = `Lunch-meny - ${tomorrow}\n\n`

    if (tomorrowsMenu.choices.length > 0) {
      for (const choice of tomorrowsMenu.choices) {
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

export async function getWeeklyVallagatMenu(): Promise<any> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

  return menu
}

export async function getWeeklyVallagatMenuString(): Promise<string> {
  // Retrieve the weekly menu
  const menu = await scrapeVallagatMenu()

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

export async function scrapeVallagatMenu(): Promise<any> {
  const response = await axios.get('https://www.vallagat.se/lunchmeny')
  const $ = cheerio.load(response.data)

  const menu: { weekNumber: string; days: { name: string; choices: string[] }[] } = { weekNumber: '', days: [] }
  let currentDay: { name: string; choices: string[] } | null = null

  // Extract week number
  menu.weekNumber = $('h1.font_0.wixui-rich-text__text').text().replace('Serveras mellan 10:45 - 13:30', '').replace('Vecka', '').replace('Lunchmeny', '').trim()

  // Target the relevant sections for each workday (sections 2 to 6)
  $('main > section')
    .slice(1, 6)
    .each((index: any, element: any) => {
      const dayName = swedishWorkDays[index]

      if (dayName) {
        // This line represents the day of the week.
        currentDay = { name: dayName, choices: [] }
        menu.days.push(currentDay)
      }

      // Navigate through nested divs to reach menu choices
      const dayContent = $(element).find('div').find('div').find('div')

      const menuChoices: any[] = []
      dayContent.each((index, choiceElement) => {
        const choiceText = $(choiceElement).text().trim()

        if (choiceText !== 'KÖTT:' && choiceText !== 'FISK:' && choiceText !== 'VEG:' && choiceText !== 'STREET FOOD:' && choiceText !== 'KÖTT / VEG:' && choiceText.includes('|') && choiceText !== currentDay?.name.toUpperCase()) {
          menuChoices.push(choiceText)
        }
      })

      if (currentDay) {
        currentDay.choices.push(...menuChoices)
      }
    })

  return menu
}
