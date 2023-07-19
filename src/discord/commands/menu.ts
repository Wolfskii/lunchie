import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/Command'
import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js'

export const menu: Command = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Get the lunch-menu options')
    .addStringOption((option) => option.setName('period').setDescription('What day or period of menu choices to fetch') /* .setRequired(true).addChoices({ name: 'Today', value: 'today' }, { name: 'Tomorrow', value: 'tomorrow' }, { name: 'Whole week', value: 'week' }) */),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!')
    // await interaction.deferReply()
    const { user } = interaction
    const text = (interaction.options as CommandInteractionOptionResolver)['getString']('period', true)
    console.log(text)
  }
}
