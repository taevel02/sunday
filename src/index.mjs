import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import dayjs from 'dayjs'
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule'
import { makeNote, noteStore } from './evernote.mjs'
import { dailyReview } from './create-evernote/daily-review.mjs'

const PORT = 8000
const SCHEDULE_RULE = new RecurrenceRule()
SCHEDULE_RULE.dayOfWeek = [new Range(1, 5)] // Mon - Fri
SCHEDULE_RULE.hour = 15
SCHEDULE_RULE.minute = 50
SCHEDULE_RULE.tz = 'Asia/Seoul'

scheduleJob(SCHEDULE_RULE, async () => {
  const title = dayjs(new Date()).format('YYYY년 M월 D일')
  const noteBody = await dailyReview()
  makeNote(noteStore, title, noteBody)
})

new Koa()
  .use(parser())
  .use(logger())
  .use(cors())
  .use((ctx, next) => {
    if (!ctx.query.text) return next()
  })
  .listen(PORT, () => console.log('Server listening on port ' + PORT))
