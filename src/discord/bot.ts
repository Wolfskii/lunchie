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

      // Deploy global commands when the bot is ready
      await this.deployGlobalCommands()

      this.registerCommands()
    })

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      const command = this.client.commands.get(interaction.commandName)

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

  async deployGlobalCommands() {
    // Prepare the commands to deploy globally
    const commands = CommandList.map((command) => command.data.toJSON())

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(this.token)

    try {
      console.log(`Started deploying ${commands.length} global application (/) commands.`)

      // The put method is used to fully refresh all commands globally with the current set
      const data = await rest.put(Routes.applicationCommands(this.client.application!.id), {
        body: commands
      })

      // console.log(`Successfully deployed ${data.length} global application (/) commands.`);
    } catch (error) {
      // Make sure you catch and log any errors
      console.error(error)
    }
  }

  registerCommands() {
    this.client.commands = new Collection()

    for (const command of CommandList) {
      // Add the command to the local client.commands collection, which includes the 'execute' function
      this.client.commands.set(command.data.name, command)
    }
  }
}

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
