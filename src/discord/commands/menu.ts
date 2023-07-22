import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/Command'
import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js'
import { postTodaysMenuToDiscord } from '../utils/menu'
import { getTodaysMenu } from '../../utils/menuScraper'

export const today: Command = {
  data: new SlashCommandBuilder().setName('today').setDescription(`Get today's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    // await interaction.deferReply()

    getTodaysMenu().then((todaysMenu: string) => {
      interaction.reply({ content: todaysMenu, ephemeral: true }) // Response only visible to executing user
    })

    /* getTodaysMenu().then((todaysMenu: string) => {
      interaction.reply(todaysMenu) // Response visible for all users in the channel
    }) */

    // interaction.editReply('Pong!') // To edit the message afterwards
  }
}
