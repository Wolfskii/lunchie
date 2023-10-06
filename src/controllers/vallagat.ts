import { Request, Response } from 'express'
import { getTodaysVallagatMenu, getTomorrowsVallagatMenu, getWeeklyVallagatMenu } from '../utils/menuScraper'

/**
 * Controller contains the controller functions for the Vällagat menu options
 */
export const controller = {
  /**
   * Function for getting the Vällagat-endpoint's index
   */
  getIndex: async (req: Request, res: Response) => {
    try {
      const response = {
        description: 'Main endpoint for the restaurant Vällagat in Gårda, Gothenburg',
        links: {
          self: { href: '/vallagat', method: 'GET', desc: `Main endpoint for the restaurant Vällagat's menu options` },
          today: { href: '/vallagat/today', method: 'GET', desc: `Get today's menu choices` },
          tomorrow: { href: '/vallagat/tomorrow', method: 'GET', desc: `Get tomorrow's menu choices` },
          week: { href: '/vallagat/week', method: 'GET', desc: `Get this week's menu choices` }
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
      const menu = await getTodaysVallagatMenu()
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
      const menu = await getTomorrowsVallagatMenu()
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
      const menu = await getWeeklyVallagatMenu()
      res.status(200).json(menu)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
