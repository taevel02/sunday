import schedule from 'node-schedule'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

import {
  AuthManagement,
  DomesticStockManagement,
  EvernoteManagement,
  TelegramBotManagement
} from './api'

import { postgres } from './db.config'
import { PersonalNotebook } from './evernote.config'

import { NoteMetadata, guid } from './interface/evernote'
import { CUSTOMER_TYPE, MarketIndex, StockInfo } from './interface/domestic'

import StockSymbol from './templates/stock-symbol'
import StockReport from './templates/stock-report'

import checkExcludedStock from './utils/check-excluded-stock'
import { api, updateHeader } from './utils/axios'

postgres.connect()

const scheduleJob = (
  hour: number,
  minute: number,
  callback: schedule.JobCallback
): schedule.Job =>
  schedule.scheduleJob(
    {
      dayOfWeek: [new schedule.Range(1, 5)],
      hour,
      minute,
      tz: 'Asia/Seoul'
    },
    callback
  )

const rescheduleJob = (job: schedule.Job, hour: number, minute: number) => {
  job.reschedule({
    dayOfWeek: [new schedule.Range(1, 5)],
    hour,
    minute,
    tz: 'Asia/Seoul'
  } as schedule.RecurrenceRule)
}

const generateTokenJob = scheduleJob(6, 30, async () => {
  if (api.defaults.headers.common['Authorization']) {
    await revokeToken()
  }

  const { result } = await AuthManagement.verify({
    grant_type: 'client_credentials',
    appkey: process.env.KIS_KEY,
    appsecret: process.env.KIS_SECRET
  })

  updateHeader('Authorization', `${result.token_type} ${result.access_token}`)
  updateHeader('appkey', process.env.KIS_KEY)
  updateHeader('appsecret', process.env.KIS_SECRET)
  updateHeader('custtype', CUSTOMER_TYPE.개인)
})

const checkHolidayJob = scheduleJob(7, 0, async () => {
  const isHoliday = await DomesticStockManagement.isHoliday(new Date())

  if (isHoliday) {
    rescheduleJob(generateTokenJob, 6, 30)
    // rescheduleJob(startTradingViewJob, 9, 0)
    // rescheduleJob(stopTradingViewJob, 15, 30)
    rescheduleJob(generateEveningJob, 15, 40)
    rescheduleJob(revokeTokenJob, 15, 50)
  }
})

// const startTradingViewJob = scheduleJob(9, 0, async () => {})

// const stopTradingViewJob = scheduleJob(15, 30, async () => {})

const generateEveningJob = scheduleJob(15, 40, async () => {
  const indexes = await DomesticStockManagement.getIndexes()
  const 상천주 = await DomesticStockManagement.get상천주()

  // 이브닝 & 신규종목 리포트 생성
  await createEvening(indexes.kospi, indexes.kosdaq, 상천주)
  await createNewStockReport(상천주)

  TelegramBotManagement.sendMessage({
    message: '금일 이브닝을 생성했습니다.'
  })
})

const revokeTokenJob = scheduleJob(15, 50, async () => {
  await revokeToken()
})

// # Sunday-AI is running...
const main = async () => {
  const headersToUpdate = ['Authorization', 'appkey', 'appsecret', 'custtype']
  headersToUpdate.forEach((header) => updateHeader(header))

  process.env.NODE_ENV === 'production'
    ? await TelegramBotManagement.sendMessage({
        message: 'Sunday-AI is running...'
      })
    : console.log('Sunday-AI is running...')

  // # control telegram commands
  TelegramBotManagement.onText(/\/list_excluded_stocks/, async () => {
    const { rows } = await postgres.query('SELECT * FROM excludestock')

    let excludeStockList = ''
    for (const [index, row] of rows.entries())
      excludeStockList += `${index + 1}/ ${row.name}(${row.id})\n`

    if (excludeStockList === '')
      await TelegramBotManagement.sendMessage({
        message: '모든 종목을 정리하고 있습니다.'
      })
    else
      await TelegramBotManagement.sendMessage({
        message: `정리하지 않는 종목은 다음과 같습니다.\n\n${excludeStockList}`
      })
  })

  TelegramBotManagement.onText(
    /\/add_excluded_stock (.+)/,
    async (_, match) => {
      const stockInfo = (
        await DomesticStockManagement.searchStockInfo({
          PDNO: match[1],
          PRDT_TYPE_CD: 300
        })
      ).result.output

      await postgres.query(
        `INSERT INTO excludestock VALUES ('${stockInfo.shtn_pdno}', '${stockInfo.prdt_abrv_name}')`
      )

      await TelegramBotManagement.sendMessage({
        message: `앞으로 ${stockInfo.prdt_abrv_name}(${stockInfo.shtn_pdno}) 종목을 정리하지 않습니다.`
      })
    }
  )

  TelegramBotManagement.onText(
    /\/delete_excluded_stock (.+)/,
    async (_, match) => {
      const stockInfo = (
        await DomesticStockManagement.searchStockInfo({
          PDNO: match[1],
          PRDT_TYPE_CD: 300
        })
      ).result.output

      await postgres.query(
        `DELETE FROM excludestock WHERE id = '${stockInfo.shtn_pdno}'`
      )

      await TelegramBotManagement.sendMessage({
        message: `${stockInfo.prdt_abrv_name}(${stockInfo.shtn_pdno}) 종목을 정리에서 제외하지 않습니다.`
      })
    }
  )

  TelegramBotManagement.onText(/\/create_evening/, async () => {
    const indexes = await DomesticStockManagement.getIndexes()
    const 상천주 = await DomesticStockManagement.get상천주()

    // 이브닝 & 신규종목 리포트 생성
    await createEvening(indexes.kospi, indexes.kosdaq, 상천주)
    await createNewStockReport(상천주)

    TelegramBotManagement.sendMessage({
      message: '임의로 이브닝을 생성했습니다.'
    })
  })
}
main()

const revokeToken = async () => {
  await AuthManagement.revoke({
    appkey: process.env.KIS_KEY,
    appsecret: process.env.KIS_SECRET,
    token: api.defaults.headers.common['Authorization'].toString().split(' ')[1]
  })

  const headersToUpdate = ['Authorization', 'appkey', 'appsecret', 'custtype']
  headersToUpdate.forEach((header) => updateHeader(header))
}

const computedSign = (index: MarketIndex) => {
  if (index.prdy_vrss_sign === '2') return '▲'
  else if (index.prdy_vrss_sign === '5') return '▼'
  else return '-'
}

const computedTextColor = (rateOfChange: number) => {
  if (rateOfChange > 0) return 'color: rgb(252, 18, 51);'
  else if (rateOfChange < 0) return 'color: rgb(13, 58, 153);'
  else return undefined
}

const createEvening = async (
  kospi: MarketIndex,
  kosdaq: MarketIndex,
  marketData: StockInfo[]
) => {
  const customExcludedStocks = await checkExcludedStock()
  let content = '<br />'

  const addStockSymbol = (name: string, rateOfChange: number, volume: number) =>
    `${StockSymbol(
      name,
      rateOfChange.toFixed(2),
      volume.toString().slice(0, -3)
    )}<br /><br /><br /><br />`

  content += `<div><span style="${computedTextColor(
    Number(kospi.bstp_nmix_prdy_ctrt)
  )}">${computedSign(kospi)}</span> 코스피 <span style="${computedTextColor(
    Number(kospi.bstp_nmix_prdy_ctrt)
  )}">${kospi.bstp_nmix_prpr} (${
    Number(kospi.bstp_nmix_prdy_ctrt) > 0
      ? '+' + kospi.bstp_nmix_prdy_ctrt
      : kospi.bstp_nmix_prdy_ctrt
  }%)</span></div>`

  content += `<div><span style="${computedTextColor(
    Number(kosdaq.bstp_nmix_prdy_ctrt)
  )}">${computedSign(kosdaq)}</span> 코스닥 <span style="${computedTextColor(
    Number(kosdaq.bstp_nmix_prdy_ctrt)
  )}">${kosdaq.bstp_nmix_prpr} (${
    Number(kosdaq.bstp_nmix_prdy_ctrt) > 0
      ? '+' + kosdaq.bstp_nmix_prdy_ctrt
      : kosdaq.bstp_nmix_prdy_ctrt
  }%)</span></div><br /><br /><br /><br />`

  for (const stockData of marketData) {
    if (customExcludedStocks.includes(stockData.code)) continue

    const name =
      stockData.name.length >= 10
        ? (
            await DomesticStockManagement.searchStockInfo({
              PDNO: stockData.code,
              PRDT_TYPE_CD: 300
            })
          ).result.output.prdt_abrv_name.replaceAll(/&/g, '&amp;')
        : stockData.name.replaceAll(/&/g, '&amp;')

    content += addStockSymbol(
      name,
      parseFloat(stockData.chgrate),
      parseInt(stockData.acml_vol)
    )
  }

  const title = dayjs(new Date()).format('YYYY.MM.DD(ddd)')
  await EvernoteManagement.makeNote(
    title,
    content,
    PersonalNotebook['01. evening']
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

const createNewStockReport = async (marketData: StockInfo[]) => {
  const stockReports = await getExistedNotes(PersonalNotebook['03. explore'])
  const tempStockReports = await getExistedNotes(PersonalNotebook['04. temp'])

  const codesInsideNoteTitle = [...tempStockReports, ...stockReports].map(
    (note) => note.title.split(/[()]/g)[1]
  )
  const customExcludedStocks = await checkExcludedStock()

  const marketDataCodes = marketData?.map((data) => data.code)
  if (marketDataCodes === undefined || marketDataCodes.length === 0) return

  // 이미 정리했던/정리하고 있는 종목은 제외하고, 리뷰할 종목들만 새로 노트 생성
  for (const [index, code] of marketDataCodes.entries()) {
    if (![...codesInsideNoteTitle, ...customExcludedStocks].includes(code)) {
      const { result } = await DomesticStockManagement.searchStockInfo({
        PDNO: code,
        PRDT_TYPE_CD: 300
      })

      await EvernoteManagement.makeNote(
        `${result.output.prdt_abrv_name.replaceAll(/&/g, '&amp;')}(${
          result.output.shtn_pdno
        })`,
        StockReport(parseInt(marketData[index].stotprice)),
        PersonalNotebook['04. temp']
      )
    }
  }
}
