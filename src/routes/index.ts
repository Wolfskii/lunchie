import express from 'express'
import { Client } from 'discord.js'
import discordRoutes from './discord'
import { controller } from '../controllers/root'
const router = express.Router()

export default (discordClient: Client) => {
  router.get('/', controller.getIndex)
  router.use('/discord', discordRoutes(discordClient))

  return router
}
