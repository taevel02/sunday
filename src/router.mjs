import Router from 'koa-router'
import { createDailyReview } from './api/services.mjs'

const router = new Router()

router.get('/daily-review', async () => {
  await createDailyReview()
})

export default router
