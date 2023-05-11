import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import router from './router'
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule'
import dayjs from 'dayjs'

import { noteStore } from './api/evernote'
import makeNote from './api/evernote/make-note'

import checkHolidays from './utils/check-holidays'
import dailyStudy from './templates/daily-study'

const PORT = 8000

const SCHEDULE_RULE = new RecurrenceRule()
SCHEDULE_RULE.dayOfWeek = [new Range(1, 5)] // Mon - Fri
SCHEDULE_RULE.hour = 15
SCHEDULE_RULE.minute = 35
SCHEDULE_RULE.tz = 'Asia/Seoul'

scheduleJob(SCHEDULE_RULE, async () => {
  const today = new Date()
  if (!checkHolidays(today)) {
    const title = dayjs(today).format('YYYY년 M월 D일')
    const content = await dailyStudy()
    makeNote(noteStore, title, content, '241a0219-4915-4708-abd4-94109dc4e352')
  } else {
    console.log('Today Korea Stock Market is Closed.')
  }
})

new Koa()
  .use(parser())
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use((ctx, next) => {
    if (!ctx.query.text) return next()
  })
  .listen(PORT, () => console.log('Server listening on port ' + PORT))
