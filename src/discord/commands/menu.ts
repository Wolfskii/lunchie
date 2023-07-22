import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/Command'
import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js'
import { postTodaysMenuToDiscord } from '../utils/menu'
import { getTodaysMenu } from '../../utils/menuScraper'

export const today: Command = {
  data: new SlashCommandBuilder().setName('today').setDescription(`Get today's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    // await postTodaysMenuToDiscord(interaction.client)
    // await interaction.deferReply()
    // await interaction.reply('Halloj') // Response visible for all users in the channel

    getTodaysMenu().then((todaysMenu: string) => {
      interaction.reply({ content: todaysMenu, ephemeral: true }) // Response only visible to executing user
    })

    // interaction.editReply('Pong!') // To edit the message afterwards
  }
}
