import { Telegraf } from 'telegraf'

import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

import {
  AuthManagement,
  DomesticStockManagement,
  EvernoteManagement
} from './api'

import { postgres } from './db.config'

import { NOTEBOOK_GUID, NoteMetadata, guid } from './interface/evernote'
import { CUSTOMER_TYPE, MarketIndex, StockInfo } from './interface/domestic'

import StockSymbol from './templates/stock-symbol'
import StockReport from './templates/stock-report'

import checkExcludedStock from './utils/check-excluded-stock'
import { KIS_API, updateHeader } from './utils/axios'

postgres.connect()

const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const sendMessage = (message: string) => {
  telegramBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
}

const generateToken = async () => {
  await revokeToken()

  const { result } = await AuthManagement.verify({
    grant_type: 'client_credentials',
    appkey: process.env.KIS_KEY,
    appsecret: process.env.KIS_SECRET
  })

  updateHeader('Authorization', `${result.token_type} ${result.access_token}`)
  updateHeader('appkey', process.env.KIS_KEY)
  updateHeader('appsecret', process.env.KIS_SECRET)
  updateHeader('custtype', CUSTOMER_TYPE.개인)

  console.log('Complete generating token.')
}

const revokeToken = async () => {
  if (KIS_API.defaults.headers.common['Authorization']) {
    await AuthManagement.revoke({
      appkey: process.env.KIS_KEY,
      appsecret: process.env.KIS_SECRET,
      token: KIS_API.defaults.headers.common['Authorization']
        .toString()
        .split(' ')[1]
    })

    console.log('Complete revoking token.')
  }

  const headersToUpdate = ['Authorization', 'appkey', 'appsecret', 'custtype']
  headersToUpdate.forEach((header) => updateHeader(header))
}

const getIndexes = async (): Promise<{
  kospi: MarketIndex
  kosdaq: MarketIndex
}> => {
  const basedMarketIndexRequest = {
    FID_COND_MRKT_DIV_CODE: 'U',
    FID_INPUT_DATE_1: dayjs(new Date()).format('YYYYMMDD'),
    FID_INPUT_DATE_2: dayjs(new Date()).format('YYYYMMDD'),
    FID_PERIOD_DIV_CODE: 'D'
  }

  const 코스피지수 = (
    await DomesticStockManagement.getMarketIndex({
      FID_INPUT_ISCD: '0001',
      ...basedMarketIndexRequest
    })
  ).result.output1

  const 코스닥지수 = (
    await DomesticStockManagement.getMarketIndex({
      FID_INPUT_ISCD: '1001',
      ...basedMarketIndexRequest
    })
  ).result.output1

  return {
    kospi: 코스피지수,
    kosdaq: 코스닥지수
  }
}

const get상천주 = async (): Promise<StockInfo[]> => {
  const _거래량1000만 = (
    await DomesticStockManagement.pSearchResult({
      user_id: 'taevel02',
      seq: 1
    })
  )?.result?.output2
  const _상한가 = (
    await DomesticStockManagement.pSearchResult({
      user_id: 'taevel02',
      seq: 2
    })
  )?.result?.output2

  if (_상한가 === undefined) {
    return _거래량1000만 || []
  }

  const filteredMarketData = _상한가.concat(
    _거래량1000만.filter(
      (vol) => !_상한가.some((upperLimit) => upperLimit.code === vol.code)
    )
  )

  return filteredMarketData
}

const get150억봉 = async (): Promise<StockInfo[]> => {
  const _150억봉 = (
    await DomesticStockManagement.pSearchResult({
      user_id: 'taevel02',
      seq: 0
    })
  )?.result?.output2

  return _150억봉 || []
}

const generateEvening = async () => {
  const indexes = await getIndexes()
  const 상천주 = await get상천주()
  const 세력봉 = await get150억봉()

  const eveningStocks = 세력봉.concat(
    상천주.filter((상천) => !세력봉.some((세력) => 세력.code === 상천.code))
  )

  // 이브닝 & 신규종목 리포트 생성
  await createEvening(indexes.kospi, indexes.kosdaq, eveningStocks)
  // await createNewStockReport(eveningStocks)

  // sendMessage(
  //   `${await gatchaRandomMessage()}\n\n오늘 공부할 종목은 ${
  //     eveningStocks.length
  //   }개 입니다!`
  // )

  console.log('Complete creating evening & new stock report.')
}

const computedSign = (index: MarketIndex): string => {
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
  // const customExcludedStocks = await checkExcludedStock()
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
    // if (customExcludedStocks.includes(stockData.code)) continue

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

  const title = `${dayjs(new Date()).format('YYYY.MM.DD(ddd)')} evening`

  await EvernoteManagement.makeNote(title, content, NOTEBOOK_GUID.evening)
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
  const notebooks = await EvernoteManagement.findAllNotebooks({
    stack: '4. stock'
  })

  const stockReports: NoteMetadata[] = []
  for (const notebook of notebooks) {
    const notes = await getExistedNotes(notebook.guid)
    stockReports.push(...notes)
  }

  const codesInsideNoteTitle = stockReports.map(
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
        NOTEBOOK_GUID.temp
      )
    }
  }
}

// const gatchaRandomMessage = async () => {
//   const { rows } = await postgres.query('SELECT * FROM messages')
//   const randomIndex = Math.floor(Math.random() * rows.length)
//   return rows[randomIndex].message
// }

telegramBot.command('create_evening', async () => {
  await generateToken()
  await generateEvening()
})

// telegramBot.command('list_excluded_stocks', async (ctx) => {
//   const { rows } = await postgres.query('SELECT * FROM excludestock')

//   let excludedStockList = ''
//   for (const [index, row] of rows.entries()) {
//     excludedStockList += `${index + 1}. ${row.name}(${row.id})\n`
//   }

//   if (excludedStockList === '') {
//     excludedStockList = '정리하지 않는 종목이 없습니다.'
//   } else {
//     ctx.reply(`정리에서 제외하는 종목 리스트\n\n${excludedStockList}`)
//   }
// })

// telegramBot.command('add_excluded_stock', async (ctx) => {
//   if (ctx.message.text.split(' ').length !== 2) {
//     ctx.reply('종목코드를 입력해주세요.')
//     return
//   }

//   await generateToken()

//   const stockId = ctx.message.text.split(' ')[1]
//   const { result } = await DomesticStockManagement.searchStockInfo({
//     PDNO: stockId,
//     PRDT_TYPE_CD: 300
//   })

//   await postgres.query(
//     `INSERT INTO excludestock (id, name) VALUES ('${stockId}', '${result.output.prdt_abrv_name}')`
//   )

//   ctx.reply(
//     `${result.output.prdt_abrv_name}(${stockId})을(를) 정리에서 제외하였습니다.`
//   )
// })

// telegramBot.command('remove_excluded_stock', async (ctx) => {
//   if (ctx.message.text.split(' ').length !== 2) {
//     ctx.reply('종목코드를 입력해주세요.')
//     return
//   }

//   await generateToken()

//   const stockId = ctx.message.text.split(' ')[1]
//   const { result } = await DomesticStockManagement.searchStockInfo({
//     PDNO: stockId,
//     PRDT_TYPE_CD: 300
//   })

//   await postgres.query(`DELETE FROM excludestock WHERE id = '${stockId}'`)

//   ctx.reply(`${result.output.prdt_abrv_name}(${stockId})을(를) 정리합니다.`)
// })

const main = () => {
  sendMessage('Sunday-AI is started.')
}
main()
telegramBot.launch()

// Enable graceful stop
process.once('SIGINT', () => {
  sendMessage('Sunday-AI is stopped.')
  telegramBot.stop('SIGINT')
  postgres.end()
})
process.once('SIGTERM', () => {
  sendMessage('Sunday-AI is stopped.')
  telegramBot.stop('SIGTERM')
  postgres.end()
})
