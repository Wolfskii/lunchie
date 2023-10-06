import moment from 'moment'
import axios from 'axios'
import cheerio from 'cheerio'

const swedishWorkDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export async function getTodaysCollectedMenuString(): Promise<string> {
  let message = '__**Lunch-meny**__\n\n'

  // Retrieve the weekly menus
  const villageMenu = await scrapeVillageMenu()
  const vallagatMenu = await scrapeVallagatMenu()

  // Find today's menu at the Village
  let today = moment().locale('sv-SE').format('dddd').toLowerCase()
  let todaysMenu = villageMenu.days.find((day: any) => day.name.toLowerCase() === today)

  // If today's menu is found
  if (todaysMenu) {
    message += `'**The Village** - *${today}:*\n\n`

    if (todaysMenu.choices.length > 0) {
      for (const choice of todaysMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }
  } else {
    message += `'**The Village** - Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }

  // Find today's menu at Vällagat
  today = moment().locale('sv-SE').format('dddd').toLowerCase()
  todaysMenu = vallagatMenu.days.find((day: any) => day.name.toLowerCase() === today)

  // If today's menu is found
  if (todaysMenu) {
    message += `'**Vällagat** - *${today}:*\n\n`

    if (todaysMenu.choices.length > 0) {
      for (const choice of todaysMenu.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- Ingen meny tillgänglig\n'
    }
  } else {
    message += `'**Vällagat** - Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`
  }

  return message
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



