import { Range, RecurrenceRule, scheduleJob } from 'node-schedule'
import dayjs from 'dayjs'

import { EvernoteManagement, StockManagement } from './api'
import checkHolidays from './utils/check-holidays'
import { logger } from './utils/logger'

const SCHEDULE_RULE = new RecurrenceRule()
SCHEDULE_RULE.dayOfWeek = [new Range(1, 5)] // Mon - Fri
SCHEDULE_RULE.hour = 15
SCHEDULE_RULE.minute = 35
SCHEDULE_RULE.tz = 'Asia/Seoul'

const createDailyStockReportContent = scheduleJob(SCHEDULE_RULE, async () => {
  const today = new Date()
  if (!checkHolidays(today)) {
    const title = dayjs(today).format('YYYY년 M월 D일')
    const content = await StockManagement.createDailyStockReportContent()
    EvernoteManagement.makeNote(
      EvernoteManagement.noteStore,
      title,
      content,
      '241a0219-4915-4708-abd4-94109dc4e352'
    )
  } else {
    logger('Today Korea Stock Market is Closed.')
  }
})

const dev = async () => {
  logger('Sunday-AI is running...')
}
dev()
