import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import dayjs from 'dayjs'
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule'
import { makeNote, noteStore } from './evernote.mjs'
import { dailyReview } from './tools/daily-review.mjs'
import checkHolidays from './utils/check-holidays.mjs'

const PORT = 8000

const SCHEDULE_RULE = new RecurrenceRule()
SCHEDULE_RULE.dayOfWeek = [new Range(1, 5)] // Mon - Fri
SCHEDULE_RULE.hour = 15
SCHEDULE_RULE.minute = 40
SCHEDULE_RULE.tz = 'Asia/Seoul'

scheduleJob(SCHEDULE_RULE, async () => {
  const today = new Date()
  if (checkHolidays(today)) return

  const title = dayjs(today).format('YYYY년 M월 D일')
  const noteBody = await dailyReview()
  makeNote(noteStore, title, noteBody, '241a0219-4915-4708-abd4-94109dc4e352')
})

new Koa()
  .use(parser())
  .use(logger())
  .use(cors())
  .use((ctx, next) => {
    if (!ctx.query.text) return next()
  })
  .listen(PORT, () => console.log('Server listening on port ' + PORT))
