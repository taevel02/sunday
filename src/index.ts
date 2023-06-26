import { Range, scheduleJob } from 'node-schedule'
import dayjs from 'dayjs'

import {
  EvernoteManagement,
  StockManagement,
  TelegramBotManagement
} from './api'
import { postgres } from './db.config'

import checkHolidays from './utils/check-holidays'
import { logger } from './utils/logger'

import { StockInfo } from './interface/stock'
import { NoteMetadata, guid } from './interface/evernote'
import { PersonalNotebook } from './evernote.config'

import StockSymbol from './templates/stock-symbol'
import StockReport from './templates/stock-report'
import checkStockToExclude from './utils/check-stock-to-exclude'

postgres.connect()

scheduleJob(
  {
    dayOfWeek: [new Range(1, 5)], // Mon - Fri
    hour: 15,
    minute: 50,
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

const main = async () => {
  logger('Sunday-AI is running...')
  process.env.NODE_ENV === 'production' &&
    (await TelegramBotManagement.sendMessage({
      message: 'Sunday-AI is running...'
    }))

  // control telegram commands
  await TelegramBotManagement.onText(/\/listexcludestock/, async () => {
    const { rows } = await postgres.query('SELECT * FROM excludestock')

    let excludeStockList = ''
    for (const [index, row] of rows.entries())
      excludeStockList += `${index + 1}/ ${row.name}(${row.id})\n`

    await TelegramBotManagement.sendMessage({
      message: `제외한 종목은 다음과 같으며, 스팩주와 우선주는 기본으로 제외됩니다.\n\n${excludeStockList}`
    })
  })

  await TelegramBotManagement.onText(
    /\/addexcludestock (.+)/,
    async (msg, match) => {
      /**
       *
       * @todo: 종목명만 입력하면 종목코드 정보는 알아서 받아오기 (KIS API)
       */
      // await postgres.query(
      //   `INSERT INTO excludestock VALUES ('', '${match[1]}')`
      // )
      // await TelegramBotManagement.sendMessage(
      //   `${match[1]}을 제외 종목에 추가하였습니다.`
      // )
    }
  )

  /**
   *
   * only development environment
   */
  if (process.env.NODE_ENV === 'development') {
    await TelegramBotManagement.onText(/\/generatestockreport/, async () => {
      const marketData = await StockManagement.getMarketData()
      await createDailyReviewReport(marketData)
      await createNewStockReport(marketData)
    })
  }
}
main()

/**
 *
 * @param marketData
 */
const createDailyReviewReport = async (marketData: StockInfo[]) => {
  let content = ''
  for (const index in marketData) {
    if (await checkStockToExclude(marketData[index].name)) continue

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

const getExistedNotes = async (parantNotebook: guid) => {
  const allNotes: NoteMetadata[] = []
  let _hasNext = true
  let _offset = 0

  while (_hasNext) {
    const { notes, hasNext } = await EvernoteManagement.findAllNotesByNotebook(
      parantNotebook,
      _offset
    )
    allNotes.push(...notes)
    _offset += notes.length
    _hasNext = hasNext
  }

  return allNotes
}

/**
 *
 * @param marketData
 * @todo: 종목 데이터 가져와서 금일 시총은 자동으로 작성될 수 있도록
 */
const createNewStockReport = async (marketData: StockInfo[]) => {
  const stockReports = await getExistedNotes(PersonalNotebook['D. 종목 리포트'])
  const tempStockReports = await getExistedNotes(
    PersonalNotebook['E. 종목 리포트 (임시)']
  )

  const noteTitles = [...tempStockReports, ...stockReports].map(
    (note) => note.title.split('(')[0]
  )
  const marketDataTitles = marketData.map((data) => data.name)

  // 이미 정리했던/정리하고 있는 종목은 제외하고, 리뷰할 종목들만 새로 노트 생성
  for (const [index, name] of marketDataTitles.entries()) {
    if (!noteTitles.includes(name)) {
      // 기타 제외할 종목도 제외
      if (!await checkStockToExclude(name)) {
        await EvernoteManagement.makeNote(
          `${name}(${marketData[index].id})`,
          StockReport(),
          PersonalNotebook['E. 종목 리포트 (임시)']
        )
      }
    }
  }
}
