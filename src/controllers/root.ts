import { Request, Response } from 'express'
import path from 'path'
const port = process.env.PORT || 3000

/**
 * Controller contains the controller functions for the root-endpoint
 */
export const controller = {
  /**
   * Function for getting the root-endpoint's index
   */
  getIndex: async (req: Request, res: Response) => {
    try {
      const ip = req.ip

      // Determine the path to package.json based on the environment
      const packageJsonPath = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '..', 'package.json') : path.resolve(__dirname, '../..', 'package.json')

      // Retrieve package.json data
      const packageJson = require(packageJsonPath)

      const response = {
        port,
        ip,
        description: packageJson.description,
        version: packageJson.version,
        creator: packageJson.author,
        repository: packageJson.repository.url,
        environment: process.env.NODE_ENV,
        links: {
          self: { href: '/', method: 'GET', desc: 'Root-URL of the Lunch-Scraper Rest-API' },
          village: { href: '/village', method: 'GET', desc: 'Main endpoint for the restaurant Village at CityGate, in Gothenburg' },
          vallagat: { href: '/vallagat', method: 'GET', desc: 'Main endpoint for the restaurant Vällagat in Gårda, Gothenburg' },
          discord: { href: '/discord', method: 'GET', desc: 'Main endpoint for all manual Discord-bot actions' }
        }
      }

      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
