import express from 'express'
import { Client } from 'discord.js'
import { controller } from '../controllers/root'

// Import specific routes
import village from './village'
import discord from './discord'

const router = express.Router()

export default (discordClient: Client) => {
  router.get('/', controller.getIndex)
  router.use('/village', village())
  router.use('/discord', discord(discordClient))

  return router
}
