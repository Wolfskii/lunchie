import { Client, TextChannel } from 'discord.js'
import { scrapeMenu } from '../menuScraper'
import cron from 'node-cron'

let client: Client | null = null // Store the client instance

export function startDiscordBot(): Client {
  client = new Client({ intents: [] })

  client.once('ready', () => {
    console.log('Discord bot is ready')

    // Schedule the menu posting task
    scheduleMenuPosting()
  })

  client.login(process.env.DISCORD_TOKEN)

  return client
}

export async function postMenuToDiscord() {
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
    const menu = await scrapeMenu()
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

function scheduleMenuPosting() {
  // Schedule the task to run every day at 9 a.m. in Sweden
  cron.schedule(
    '* 13 5 * * *',
    async () => {
      const menu = await scrapeMenu()
      postMenuToDiscord()
    },
    {
      timezone: 'Europe/Stockholm'
    }
  )
}
