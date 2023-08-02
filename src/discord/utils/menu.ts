import moment from 'moment'
import { Client, TextChannel } from 'discord.js'
import { getTodaysMenu, getTomorrowsMenu, getWeeklyMenu } from '../../utils/menuScraper'

export async function postTodaysMenuToDiscord(client: Client) {
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
    const menu = await getTodaysMenu()

    // Post it to Discord
    await channel.send(menu)
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
    const menu = await getTomorrowsMenu()

    // Post it to Discord
    await channel.send(menu)
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}

export async function postWeeklyMenuToDiscord(client: Client) {
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
    const menu = await getWeeklyMenu()

    // Post it to Discord
    await channel.send(menu)
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}
