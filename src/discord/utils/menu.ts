import { Client, TextChannel } from 'discord.js'
import { getTodaysCollectedMenuString, getTomorrowsCollectedMenuString, getWeeklyCollectedMenuStrings } from '../../utils/menuScraper'

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
    const menu = await getTodaysCollectedMenuString()

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
    const menu = await getTomorrowsCollectedMenuString()

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
    const weeksMenuStrings = await getWeeklyCollectedMenuStrings()

    // Post each restaurant's menu as separate messages
    for (const menuString of weeksMenuStrings) {
      await channel.send(menuString)
    }
  } catch (error) {
    console.error('Error posting menu to Discord:', error)
  }
}

