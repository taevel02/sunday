import { Range, scheduleJob } from 'node-schedule'
import dayjs from 'dayjs'

import {
  AuthManagement,
  DomesticStockManagement,
  EvernoteManagement,
  TelegramBotManagement
} from './api'

import { postgres } from './db.config'
import { PersonalNotebook } from './evernote.config'

import { NoteMetadata, guid } from './interface/evernote'
import { StockInfo } from './interface/domestic'

import StockSymbol from './templates/stock-symbol'
import StockReport from './templates/stock-report'

import checkStockToExclude from './utils/check-stock-to-exclude'
import { updateHeader } from './utils/axios'
import isTokenExpired from './utils/is-token-expired'
import { logger } from './utils/logger'

postgres.connect()

scheduleJob(
  {
    dayOfWeek: [new Range(1, 5)], // Mon - Fri
    hour: 15,
    minute: 50,
    tz: 'Asia/Seoul'
  },
  async () => {
    const { result } = await DomesticStockManagement.checkHoliday({
      BASS_DT: dayjs(new Date()).format('YYYYMMDD'),
      CTX_AREA_FK: '',
      CTX_AREA_NK: ''
    })

    if (result.output[0].bzdy_yn === 'Y') {
      const 상천주 = await DomesticStockManagement.get상천주()
      const 상승봉 = await DomesticStockManagement.get1000억봉()

      // 데일리 상천주 정리
      await createDailyReviewReport(상천주)

      // 정리 안되어 있는 종목들 신규 생성
      await createNewStockReport(상천주)

      // 차트상 관심주 정리 (1000억 봉)
      await createDailyChartStudy(상승봉)

      // TelegramBotManagement.sendMessage({
      //   message:
      //     '금일 국내 증시의 상천주와 1000억봉이 출현한 종목 정리 노트를 생성했습니다.'
      // })
    } else {
      logger('금일 국내 증시는 휴장입니다.')
    }
  }
)

const main = async () => {
  /**
   *
   * 1. check for a valid token
   * 2. if the token is invalid, generate a new access token
   * 3. and then update the headers.
   */
  const { rows } = await postgres.query('SELECT * FROM auth')
  if (rows !== null && rows !== undefined) {
    if (isTokenExpired({ exp: rows?.at(-1)?.expired_at }))
      await generateAccessToken()
    else {
      logger('유효한 토큰이 이미 있습니다')

      updateHeader('Authorization', `Bearer ${rows?.at(-1).access_token}`)
      updateHeader('appkey', process.env.KIS_KEY)
      updateHeader('appsecret', process.env.KIS_SECRET)
    }
  } else {
    await generateAccessToken()
  }

  // # Sunday-AI is running...
  logger('Sunday-AI is running...')
  process.env.NODE_ENV === 'production' &&
    (await TelegramBotManagement.sendMessage({
      message: 'Sunday-AI is running...'
    }))

  // # control telegram commands
  TelegramBotManagement.onText(/\/listexcludestock/, async () => {
    const { rows } = await postgres.query('SELECT * FROM excludestock')

    let excludeStockList = ''
    for (const [index, row] of rows.entries())
      excludeStockList += `${index + 1}/ ${row.name}(${row.id})\n`

    await TelegramBotManagement.sendMessage({
      message: `정리에서 제외한 개별종목은 다음과 같습니다.\n\n${excludeStockList}`
    })
  })

  TelegramBotManagement.onText(/\/addexcludestock (.+)/, async (msg, match) => {
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
  })

  TelegramBotManagement.onText(/\/generatestockreport/, async () => {
    const 상천주 = await DomesticStockManagement.get상천주()
    const 상승봉 = await DomesticStockManagement.get1000억봉()

    // 데일리 상천주 정리
    await createDailyReviewReport(상천주)

    // 정리 안되어 있는 종목들 신규 생성
    await createNewStockReport(상천주)

    // 차트상 관심주 정리 (1000억 봉)
    await createDailyChartStudy(상승봉)
  })
}
main()

const generateAccessToken = async () => {
  const { result } = await AuthManagement.verify({
    grant_type: 'client_credentials',
    appkey: process.env.KIS_KEY,
    appsecret: process.env.KIS_SECRET
  })

  if (result) {
    /**
     *
     * @todo 인젝션 방지를 위해 쿼리 파라미터화. 두 번째 매개변수로 쿼리 매개변수를 전달하는 것이 좋습니다.
     */
    await postgres.query(
      `INSERT INTO auth (access_token, expired_at) VALUES ('${
        result.access_token
      }', ${Number(Date.now().valueOf() / 1000) + result.expires_in})`
    )

    updateHeader('Authorization', `${result.token_type} ${result.access_token}`)
    updateHeader('appkey', process.env.KIS_KEY)
    updateHeader('appsecret', process.env.KIS_SECRET)
  } else {
    updateHeader('Authorization')
    updateHeader('appkey')
    updateHeader('appsecret')
  }
}

const createDailyReviewReport = async (marketData: StockInfo[]) => {
  let content = ''
  for (const index in marketData) {
    if (await checkStockToExclude(marketData[index].name)) continue

    const name = marketData[index].name.replaceAll(/&/g, '&amp;')

    const rateOfChange = parseFloat(marketData[index].chgrate).toFixed(2)
    const tradeVolume = parseInt(marketData[index].acml_vol)
      .toString()
      .slice(0, -3)

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
      if (!(await checkStockToExclude(name))) {
        await EvernoteManagement.makeNote(
          `${name}(${marketData[index].code})`,
          StockReport(parseInt(marketData[index].stotprice)),
          PersonalNotebook['E. 종목 리포트 (임시)']
        )
      }
    }
  }
}

const createDailyChartStudy = async (marketData: StockInfo[]) => {
  let content = `<b>[상승봉] 1000억 봉</b><br /><br />-(0일차) `
  for (const index in marketData) {
    if (await checkStockToExclude(marketData[index].name)) continue

    const name = marketData[index].name.replaceAll(/&/g, '&amp;')
    content += `${name} `
  }

  await EvernoteManagement.makeNote(
    dayjs(new Date(Date.now() + 3600 * 1000 * 24)).format('YYYY년 M월 D일'),
    content,
    PersonalNotebook['C. 차트상 관심주']
  )
}
