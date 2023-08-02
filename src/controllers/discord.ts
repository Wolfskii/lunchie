import { Request, Response } from 'express'
import { Client } from 'discord.js'
import { postTodaysMenuToDiscord, postTomorrowsMenuToDiscord, postWeeklyMenuToDiscord } from '../discord/utils/menu'

/**
 * Controller contains the controller functions for the discord-bot
 */
export const controller = {
  /**
   * Function for getting the Discord-endpoint's index
   */
  getIndex: async (req: Request, res: Response) => {
    try {
      const response = {
        description: 'Main index endpoint the for Discord-bot',
        links: {
          self: { href: '/', method: 'GET', desc: 'Main index endpoint for the Discord-bot of the REST-API' },
          today: { href: '/today', method: 'GET', desc: `Post today's menu choices to Discord endpoint` },
          tomorrow: { href: '/today', method: 'GET', desc: `Post tomorrow's menu choices to Discord` },
          week: { href: '/today', method: 'GET', desc: `Post this week's menu choices to Discord endpoint` }
        }
      }

      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for posting today's menu to Discord
   */
  postTodaysMenuToDiscord: async (req: Request, res: Response, discordClient: Client) => {
    try {
      await postTodaysMenuToDiscord(discordClient)
      res.status(200).json({ message: `Today's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for posting tomorrow's menu to Discord
   */
  postTomorrowsMenuToDiscord: async (req: Request, res: Response, discordClient: Client) => {
    try {
      await postTomorrowsMenuToDiscord(discordClient)
      res.status(200).json({ message: `Tomorrow's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for posting this week's menu to Discord
   */
  postWeeklyMenuToDiscord: async (req: Request, res: Response, discordClient: Client) => {
    try {
      await postWeeklyMenuToDiscord(discordClient)
      res.status(200).json({ message: `This week's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
