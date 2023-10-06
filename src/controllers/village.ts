import { Request, Response } from 'express'
import { getTodaysVillageMenu, getTomorrowsVillageMenu, getWeeklyVillageMenu } from '../utils/menuScraper'

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
  getTodaysMenu: async (req: Request, res: Response) => {
    try {
      const menu = await getTodaysVillageMenu()
      res.status(200).json(menu)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for getting tomorrow's menu
   */
  getTomorrowsMenu: async (req: Request, res: Response) => {
    try {
      const menu = await getTomorrowsVillageMenu()
      res.status(200).json(menu)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  /**
   * Function for getting this week's menu
   */
  getWeeklyMenu: async (req: Request, res: Response) => {
    try {
      const menu = await getWeeklyVillageMenu()
      res.status(200).json(menu)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
