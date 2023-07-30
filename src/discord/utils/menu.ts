import moment from 'moment'
import { Client, TextChannel } from 'discord.js'
import { scrapeVillageMenu } from '../../utils/menuScraper'

export async function postTodaysMenuToDiscord(client: Client) {
  try {
    // Get the Discord channel ID where you want to post the menu
    const channelId = process.env.DISCORD_CHANNEL_ID

    // Fetch the channel by its ID
    const channel = (await client.channels.fetch(channelId!)) as TextChannel

    // Retrieve the menu
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

      await channel.send(message)
    } else {
      await channel.send(`Idag är det ${today} och det finns därför ingen meny tillgänglig. Trevlig helg!`)
      console.log(`No menu found for ${today}`)
    }
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}

export async function postTomorrowsMenuToDiscord(client: Client) {
  try {
    if (!client) {
      console.error('Discord client is not initialized')
      return
    }

    // Get the Discord channel ID where you want to post the menu
    const channelId = process.env.DISCORD_CHANNEL_ID

    // Fetch the channel by its ID
    const channel = (await client.channels.fetch(channelId!)) as TextChannel

    // Retrieve the menu
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

      await channel.send(message)
    } else {
      await channel.send(`Imorgon är det ${tomorrow} och det finns därför ingen meny tillgänglig. Trevlig helg!`)
      console.log(`No menu found for ${tomorrow}`)
    }
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}

export async function postWholeWeeksMenuToDiscord(client: Client) {
  try {
    if (!client) {
      console.error('Discord client is not initialized')
      return
    }

    // Get the Discord channel ID where you want to post the menu
    const channelId = process.env.DISCORD_CHANNEL_ID

    // Fetch the channel by its ID
    const channel = (await client.channels.fetch(channelId!)) as TextChannel

    // Retrieve and post the menu
    const menu = await scrapeVillageMenu()
    let message = `Lunch-meny - Vecka ${menu.weekNumber}\n\n`

    for (const day of menu.days) {
      message += `**${day.name}**\n`

      if (day.choices.length > 0) {
        for (const choice of day.choices) {
          message += `- ${choice}\n`
        }
      } else {
        message += '- Ingen meny tillgänglig\n'
      }

      message += '\n'
    }

    await channel.send(message)
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}
