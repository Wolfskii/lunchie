import { Client, Events, TextChannel, CommandInteraction, Collection, Interaction, StringSelectMenuInteraction, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { scrapeVillageMenu } from '../utils/menuScraper'
import cron from 'node-cron'
import { CommandList } from './commands/commandList'

export class DiscordBot {
  private client: Client
  private token: string

  constructor(client: Client, token: string) {
    this.client = client
    this.token = token
  }

  start() {
    this.client.once(Events.ClientReady, async (bot) => {
      console.log(`Discord bot ${bot.user.tag} is ready`)

      this.registerCommands()
    })

    this.client.on(Events.InteractionCreate, async (interaction) => {
      const guildId = interaction.guildId

      console.log('Received interaction:', interaction)
      console.log('Guild ID:', guildId) // Log the guildId

      if (!interaction.isChatInputCommand()) return

      console.log(interaction)

      const command = interaction.client.commands.get(interaction.commandName)

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
      }

      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
      }
    })

    this.client.login(this.token)
  }

  registerCommands() {
    this.client.commands = new Collection()

    for (const command of CommandList) {
      this.client.commands.set(command.data.name, command)
    }
  }

  interactionCreateListener(interaction: Interaction) {
    // Checks so that the interaction is a slash-command
    if (interaction.isChatInputCommand()) {
      console.log('Received interaction:', interaction)

      /*     const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    } else {
      console.log('Command:', command)
    } */

      /*       try {
        // await command.execute(interaction)
      } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
      } */

      /*       for (const Command of CommandList) {
        if (interaction.commandName === Command.data.name) {
          await Command.execute(interaction)
          break
        }
      } */
    }
  }

  /* async function handleMenuCommand(interaction: CommandInteraction) {
  const period = interaction.options

  if (period === 'today') {
    await postTodaysMenuToDiscord()
  } else if (period === 'tomorrow') {
    await postTomorrowsMenuToDiscord()
  } else if (period === 'week') {
    await postWholeWeeksMenuToDiscord()
  }

  await interaction.reply('Menu options posted to Discord.')
} */

  /*   scheduleMenuPosting() {
    // Schedule the task to run every day at 9 a.m. in Sweden
    cron.schedule(
      '0 8 * * 1-5',
      async () => {
        const menu = await scrapeMenu()
        await postTodaysMenuToDiscord()
      },
      {
        timezone: 'Europe/Stockholm'
      }
    )
  } */
}
