import dayjs from 'dayjs'

import {
  IndexInfo,
  readAllStocks,
  readIndex,
  readMaxWorkDate,
  readStockIssues
} from '../api/krx'
import { makeNote } from '../api/evernote'

import {
  is스팩주,
  is우선주,
  거래대금150억이상,
  거래량1000만이상,
  상한가,
  상한가테마추적
} from '../tools/search-condition'
import { addStockSymbol } from '../tools/templates'
import { filterAsync } from '../tools/filter-async'

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

  const [stkIssues, ksqIssues] = await Promise.all([
    readStockIssues('STK'),
    readStockIssues('KSQ')
  ])
  const issuedStocks = [...stkIssues, ...ksqIssues].filter((issue) =>
    uniqueStocks.some(
      (uniqueStock) => uniqueStock.ISU_SRT_CD === issue.ISU_SRT_CD
    )
  )

  const hasIssue = uniqueStocks.filter((stock) =>
    issuedStocks.some(
      (issue) =>
        issue.ISU_SRT_CD === stock.ISU_SRT_CD &&
        (issue.ADMISU_YN === 'O' ||
          issue.HALT_YN === 'O' ||
          issue.INVSTCAUTN_REMND_ISU_YN === 'O')
    )
  )

  const has스팩주 = uniqueStocks.filter((stock) => is스팩주(stock.ISU_ABBRV))

  const has우선주 = await filterAsync(uniqueStocks, (stock) =>
    is우선주(stock.ISU_SRT_CD)
  )

  const issueSet = new Set(hasIssue)
  const 스팩주Set = new Set(has스팩주)
  const 우선주Set = new Set(has우선주)

  const terminalStocks = uniqueStocks.filter(
    (stock) =>
      !issueSet.has(stock) && !스팩주Set.has(stock) && !우선주Set.has(stock)
  )

  let content = ''

  const addIndexInfo = (index: IndexInfo) =>
    `<span style="${computedTextColor(index)}">${computedSign(
      index
    )} ${index.IDX_NM.slice(0, 3)} ${parseFloat(
      index.CLSPRC_IDX.replace(/,/g, '')
    ).toFixed(2)} (${
      parseFloat(index.FLUC_RT) > 0
        ? `+${parseFloat(index.FLUC_RT).toFixed(2)}`
        : parseFloat(index.FLUC_RT).toFixed(2)
    }%)</span>`

  content += addIndexInfo(코스피지수) + '<br />'
  content += addIndexInfo(코스닥지수) + '<br /><br /><br /><br />'

  for (const stock of terminalStocks) {
    content += addStockSymbol(stock) + '<br /><br /><br />'
  }

  // TODO: 사용자가 노트북을 선택할 수 있도록
  const date = await readMaxWorkDate()
  await makeNote(
    `${dayjs(date).format('YYYY.MM.DD(ddd)')} evening`,
    content,
    '241a0219-4915-4708-abd4-94109dc4e352' // notebook guid
  )
}
