import dayjs from 'dayjs'

import {
  IndexInfo,
  StockInfo,
  readAllStocks,
  readIndex,
  readMaxWorkDate,
  readStockIssues
} from '../api/krx'
import { makeNote } from '../api/evernote'

import {
  is스팩주,
  is우량주,
  거래대금150억이상,
  거래량1000만이상,
  상한가,
  상한가테마추적
} from '../tools/search-condition'
import { addStockSymbol } from '../tools/templates'
import { parseNumberWithFloat } from '../tools/formatter'

const computedSign = (index: IndexInfo) => {
  if (index.FLUC_TP_CD === '1') return '▲'
  else if (index.FLUC_TP_CD === '2') return '▼'

  return '-'
}

const computedTextColor = (index: IndexInfo) => {
  const rate = parseFloat(index.FLUC_RT)

  if (rate > 0) return 'color: rgb(252, 18, 51);'
  else if (rate < 0) return 'color: rgb(13, 58, 153);'

  return undefined
}

export const generateEvening = async () => {
  const KRX = [...(await readAllStocks('STK')), ...(await readAllStocks('KSQ'))]
  const 코스피지수 = (await readIndex('02'))[1]
  const 코스닥지수 = (await readIndex('03'))[1]

  // TODO: 사용자가 원하는 조건검색식을 만들고 적용할 수 있도록
  const stocks = [
    ...상한가(KRX),
    ...거래량1000만이상(KRX),
    ...거래대금150억이상(KRX),
    ...상한가테마추적(KRX)
  ]

  const uniqueStocks = [
    ...new Set(stocks.map((stock) => stock.ISU_SRT_CD))
  ].map((code) => stocks.find((stock) => stock.ISU_SRT_CD === code))

  const stockIssues = [
    ...(await readStockIssues('STK')),
    ...(await readStockIssues('KSQ'))
  ].filter((issue) =>
    uniqueStocks.some(
      (uniqueStock) => uniqueStock.ISU_SRT_CD === issue.ISU_SRT_CD
    )
  )

  // TODO: 조건검색 커스텀, 사용자제외종목
  const terminalStocks: StockInfo[] = uniqueStocks.filter((stock) => {
    // 관리종목, 환기종목, 거래정지 제외
    const hasIssue = stockIssues.some(
      (issue) =>
        issue.ISU_SRT_CD === stock.ISU_SRT_CD &&
        (issue.ADMISU_YN === 'O' ||
          issue.HALT_YN === 'O' ||
          issue.INVSTCAUTN_REMND_ISU_YN === 'O')
    )

    return !hasIssue && !is스팩주(stock.ISU_ABBRV) && !is우량주(stock.ISU_ABBRV)
  })

  let content = ''

  const addIndexInfo = (index: IndexInfo) =>
    `<span style="${computedTextColor(index)}">${computedSign(
      index
    )} ${index.IDX_NM.slice(0, 3)} ${parseNumberWithFloat(index.CLSPRC_IDX)} (${
      parseFloat(index.FLUC_RT) > 0
        ? `+${parseFloat(index.FLUC_RT).toFixed(2)}`
        : `-${parseFloat(index.FLUC_RT).toFixed(2)}`
    }%)</span>`

  content += addIndexInfo(코스피지수) + '<br />'
  content += addIndexInfo(코스닥지수) + '<br /><br /><br /><br />'

  for (const stock of terminalStocks) {
    content += addStockSymbol(stock) + '<br /><br /><br />'
  }

  /**
   * TODO:
   * 1. 사용자가 노트북을 선택할 수 있도록?
   * 2. 사용자가 title을 입력할 수 있도록?
   */
  const date = await readMaxWorkDate()
  await makeNote(
    `${dayjs(date).format('YYYY.MM.DD(ddd)')} evening`,
    content,
    '241a0219-4915-4708-abd4-94109dc4e352'
  )
}
