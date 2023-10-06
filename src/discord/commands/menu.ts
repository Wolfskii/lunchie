import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/Command'
import { CommandInteraction, TextChannel } from 'discord.js'
import { getTodaysCollectedMenuString, getTomorrowsCollectedMenuString, getWeeklyCollectedMenuStrings } from '../../utils/menuScraper'

// ENGLISH COMMANDS:
export const today: Command = {
  data: new SlashCommandBuilder().setName('today').setDescription(`Get today's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    // await interaction.deferReply()

    getTodaysCollectedMenuString().then((todaysMenu: string) => {
      interaction.reply({ content: todaysMenu, ephemeral: true }) // Response only visible to executing user
    })

    /* getTodaysMenu().then((todaysMenu: string) => {
      interaction.reply(todaysMenu) // Response visible for all users in the channel
    }) */

    // interaction.editReply('Pong!') // To edit the message afterwards
  }
}

export const tomorrow: Command = {
  data: new SlashCommandBuilder().setName('tomorrow').setDescription(`Get tomorrow's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    getTomorrowsCollectedMenuString().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const week: Command = {
  data: new SlashCommandBuilder().setName('week').setDescription(`Get this week's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    const weeksMenuStrings = await getWeeklyCollectedMenuStrings()

    for (let i = 0; i < weeksMenuStrings.length; i++) {
      const menuString = weeksMenuStrings[i]

      if (i === 0) {
        // Use .reply for the first menuString
        await interaction.reply({ content: menuString, ephemeral: true })
      } else {
        // Use .followUp for the rest of the menuStrings
        await interaction.followUp({ content: menuString, ephemeral: true })
      }
    }
  }
}

// SWEDISH COMMANDS:
export const idag: Command = {
  data: new SlashCommandBuilder().setName('idag').setDescription(`Visa dagens lunch-val`),
  async execute(interaction: CommandInteraction) {
    getTodaysCollectedMenuString().then((todaysMenu: string) => {
      interaction.reply({ content: todaysMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const imorgon: Command = {
  data: new SlashCommandBuilder().setName('imorgon').setDescription(`Visa morgondagens lunch-val`),
  async execute(interaction: CommandInteraction) {
    getTomorrowsCollectedMenuString().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const vecka: Command = {
  data: new SlashCommandBuilder().setName('vecka').setDescription(`Visa hela veckans lunch-val`),
  async execute(interaction: CommandInteraction) {
    const weeksMenuStrings = await getWeeklyCollectedMenuStrings()

    for (let i = 0; i < weeksMenuStrings.length; i++) {
      const menuString = weeksMenuStrings[i]

      if (i === 0) {
        // Use .reply for the first menuString
        await interaction.reply({ content: menuString, ephemeral: true })
      } else {
        // Use .followUp for the rest of the menuStrings
        await interaction.followUp({ content: menuString, ephemeral: true })
      }
    }
  }
}
