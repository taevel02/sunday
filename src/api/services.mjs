import dayjs from 'dayjs'
import { makeNote, noteStore } from '../evernote.mjs'
import { dailyReview } from '../tools/daily-review.mjs'
import checkHolidays from '../utils/check-holidays.mjs'

const createDailyReview = async () => {
  const today = new Date()
  if (!checkHolidays(today)) {
    const title = dayjs(today).format('YYYY년 M월 D일')
    const noteBody = await dailyReview()
    makeNote(noteStore, title, noteBody, '241a0219-4915-4708-abd4-94109dc4e352')
  } else {
    console.log('Today Korea Stock Market is Closed.')
  }
}

export { createDailyReview }
