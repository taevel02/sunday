import Router from 'koa-router'
import checkHolidays from './utils/check-holidays'
import dayjs from 'dayjs'
import dailyStudy from './templates/daily-study'
import { noteStore } from './api/evernote'
import makeNote from './api/evernote/make-note'

const router = new Router()

router.get('/daily-study', async () => {
  const today = new Date()
  if (!checkHolidays(today)) {
    const title = dayjs(today).format('YYYY년 M월 D일')
    const content = await dailyStudy()
    makeNote(noteStore, title, content, '241a0219-4915-4708-abd4-94109dc4e352')
  } else {
    console.log('Today Korea Stock Market is Closed.')
  }
})

export default router
