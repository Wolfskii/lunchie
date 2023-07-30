import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/Command'
import { CommandInteraction } from 'discord.js'
import { getTodaysMenu, getTomorrowsMenu, getWeeklyMenu } from '../../utils/menuScraper'

// ENGLISH COMMANDS:
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

export const tomorrow: Command = {
  data: new SlashCommandBuilder().setName('tomorrow').setDescription(`Get tomorrow's lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    getTomorrowsMenu().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const week: Command = {
  data: new SlashCommandBuilder().setName('week').setDescription(`Get this weeks lunch-menu options`),
  async execute(interaction: CommandInteraction) {
    getWeeklyMenu().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

// SWEDISH COMMANDS:
export const idag: Command = {
  data: new SlashCommandBuilder().setName('idag').setDescription(`Visa dagens lunch-val`),
  async execute(interaction: CommandInteraction) {
    getTodaysMenu().then((todaysMenu: string) => {
      interaction.reply({ content: todaysMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const imorgon: Command = {
  data: new SlashCommandBuilder().setName('imorgon').setDescription(`Visa morgondagens lunch-val`),
  async execute(interaction: CommandInteraction) {
    getTomorrowsMenu().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}

export const vecka: Command = {
  data: new SlashCommandBuilder().setName('vecka').setDescription(`Visa hela veckans lunch-val`),
  async execute(interaction: CommandInteraction) {
    getWeeklyMenu().then((tomorrowsMenu: string) => {
      interaction.reply({ content: tomorrowsMenu, ephemeral: true }) // Response only visible to executing user
    })
  }
}
