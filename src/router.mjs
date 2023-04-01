import Router from 'koa-router'
import dayjs from 'dayjs'
import { dailyReview } from './create-evernote/daily-review.mjs'
import { makeNote, noteStore } from './evernote.mjs'

const router = new Router()

router.get('/create-evernote/daily-review', async (ctx, next) => {
  const title = dayjs(new Date()).format('YYYY년 M월 D일')
  const noteBody = await dailyReview()

  makeNote(noteStore, title, noteBody)
  ctx.body = noteBody
  return next()
})

export default router
