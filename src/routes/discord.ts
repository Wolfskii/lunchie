import express from 'express'
import { Client } from 'discord.js'
import { controller } from '../controllers/discord'
const router = express.Router()

export default (discordClient: Client) => {
  router.get('/', (req, res) => controller.getIndex(req, res))
  router.get('/today', (req, res) => controller.postTodaysMenuToDiscord(req, res, discordClient))
  router.get('/tomorrow', (req, res) => controller.postTomorrowsMenuToDiscord(req, res, discordClient))
  router.get('/week', (req, res) => controller.postWeeklyMenuToDiscord(req, res, discordClient))

  return router
}
