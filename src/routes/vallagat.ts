import express from 'express'
import { controller } from '../controllers/vallagat'
const router = express.Router()

export default () => {
  router.get('/', controller.getIndex)
  router.get('/today', controller.getTodaysMenu)
  router.get('/tomorrow', controller.getTomorrowsMenu)
  router.get('/week', controller.getWeeklyMenu)

  return router
}
