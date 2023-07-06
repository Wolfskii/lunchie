import { Client, TextChannel } from 'discord.js'
import cron from 'node-cron'
import { scrapeMenu } from '../menuScraper'

// Rest of the code...

export function startDiscordBot() {
  const client = new Client({ intents: [] })

  client.once('ready', () => {
    console.log('Discord bot is ready')

    // Schedule the menu posting task
    scheduleMenuPosting(client)
  })

  client.login(process.env.DISCORD_TOKEN)

  return client
}

function scheduleMenuPosting(client: Client) {
  // Schedule the task to run every day at 9 a.m. in Sweden
  cron.schedule(
    '0 9 * * 1-5',
    async () => {
      const menu = await scrapeMenu()
      postMenuToDiscord(menu, client)
    },
    {
      timezone: 'Europe/Stockholm'
    }
  )
}

export function postMenuToDiscord(menu: any, client: Client) {
  // Get the Discord channel ID where you want to post the menu
  const channelId = '<your_channel_id>'

  // Find the Discord channel by ID
  const channel = client.channels.cache.get(channelId) as TextChannel

  // Create the message content
  let message = `Lunch Menu - Week ${menu.weekNumber}\n\n`

  for (const day of menu.days) {
    message += `**${day.name}**\n`

    if (day.choices.length > 0) {
      for (const choice of day.choices) {
        message += `- ${choice}\n`
      }
    } else {
      message += '- No menu available\n'
    }

    message += '\n'
  }

  // Send the message to the Discord channel
  channel.send(message)
}
