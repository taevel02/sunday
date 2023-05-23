import { Range, scheduleJob } from 'node-schedule'
import dayjs from 'dayjs'

import { EvernoteManagement, StockManagement } from './api'
import checkHolidays from './utils/check-holidays'
import { logger } from './utils/logger'

import { StockInfo } from './interface/stock'
import { NoteMetadata } from './interface/evernote'
import { PersonalNotebook } from './evernote.config'

import StockSymbol from './templates/stock-symbol'
import StockReport from './templates/stock-report'

/**
 *
 * @param marketData
 */
const createDailyReviewReport = async (marketData: StockInfo[]) => {
  let content = ''
  for (const index in marketData) {
    let name = marketData[index].name
    name = name.replaceAll(/&/g, '&amp;')

    const rateOfChange = marketData[index].rateOfChange.toFixed(2)
    const tradeVolume = marketData[index].tradeVolume.toString().slice(0, -3)

    content += `${StockSymbol(
      name,
      rateOfChange,
      tradeVolume
    )}<br /><br /><br />`
  }

  await EvernoteManagement.makeNote(
    dayjs(new Date()).format('YYYY년 M월 D일'),
    content,
    PersonalNotebook['A. 상천주 정리 및 원인 조사']
  )
}

/**
 *
 * @param marketData
 * @todo: 종목 데이터 가져와서 금일 시총은 자동으로 작성될 수 있도록
 */
const createNewStockReport = async (marketData: StockInfo[]) => {
  const allNotes: NoteMetadata[] = []
  let _hasNext = true
  let _offset = 0

  while (_hasNext) {
    const { notes, hasNext } = await EvernoteManagement.findAllNotesByNotebook(
      PersonalNotebook['D. 종목 리포트'],
      _offset
    )
    allNotes.push(...notes)
    _offset += notes.length
    _hasNext = hasNext
  }

  const noteTitles = allNotes.map((note) => note.title.split('(')[0])
  const marketDataTitles = marketData.map((data) => data.name)

  // 이미 리뷰했던 종목은 제외하고, 리뷰할 종목들만 새로 노트 생성
  for (const [index, name] of marketDataTitles.entries()) {
    if (!noteTitles.includes(name)) {
      await EvernoteManagement.makeNote(
        `${name}(${marketData[index].id})`,
        StockReport(),
        PersonalNotebook['E. 종목 리포트 (임시)']
      )
    }
  }
}

scheduleJob(
  {
    dayOfWeek: [new Range(1, 5)], // Mon - Fri
    hour: 15,
    minute: 35,
    tz: 'Asia/Seoul'
  },
  async () => {
    if (!checkHolidays(new Date())) {
      const marketData = await StockManagement.getMarketData()

      await createDailyReviewReport(marketData)
      await createNewStockReport(marketData)
    } else {
      logger('Today Korea Stock Market is Closed.')
    }
  }
)

const dev = async () => {
  logger('Sunday-AI is running...')
}
dev()
