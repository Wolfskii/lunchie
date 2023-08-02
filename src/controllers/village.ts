import { Request, Response } from 'express'
import { getTodaysMenu, getTomorrowsMenu, getWeeklyMenu } from '../utils/menuScraper'

/**
 * Controller contains the controller functions for the Village menu options
 */
export const controller = {
  /**
   * Function for getting the Village-endpoint's index
   */
  getIndex: async (req: Request, res: Response) => {
    try {
      const response = {
        description: 'Main endpoint for the restaurant Village at CityGate, in Gothenburg',
        links: {
          self: { href: '/village', method: 'GET', desc: `Main endpoint for the restaurant Village's menu options` },
          today: { href: '/village/today', method: 'GET', desc: `Get today's menu choices` },
          tomorrow: { href: '/village/tomorrow', method: 'GET', desc: `Get tomorrow's menu choices` },
          week: { href: '/village/week', method: 'GET', desc: `Get this week's menu choices` }
        }
      }

      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for getting today's menu
   */
  getTodaysMenuToDiscord: async (req: Request, res: Response) => {
    try {
      await getTodaysMenu()
      res.status(200).json({ message: `Today's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for getting tomorrow's menu
   */
  getTomorrowsMenuToDiscord: async (req: Request, res: Response) => {
    try {
      await getTomorrowsMenu()
      res.status(200).json({ message: `Tomorrow's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for getting this week's menu
   */
  getWeeklyMenuToDiscord: async (req: Request, res: Response) => {
    try {
      await getWeeklyMenu()
      res.status(200).json({ message: `This week's menu-choices posted to Discord` })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
