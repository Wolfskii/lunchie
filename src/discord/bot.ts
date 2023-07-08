import { Client, TextChannel } from 'discord.js'
import { scrapeMenu } from '../menuScraper'

export function startDiscordBot() {
  const client = new Client({ intents: [] })

  client.once('ready', async () => {
    console.log('Discord bot is ready')
  })

  client.login(process.env.DISCORD_TOKEN)

  return client
}

export async function postMenuToDiscord(client: Client) {
  try {
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
