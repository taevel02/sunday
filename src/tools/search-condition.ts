import { StockInfo, StockIssueInfo } from '../api/krx'
import { parseInteger } from './formatter'

export const is스팩주 = (ISU_ABBRV: string): Boolean => {
  return ISU_ABBRV.includes('스팩')
}

// TODO: 우량주를 체크하는 방법?
// 종목명에 '우'가 포함되는 식으로 처리하면 이오플로우, 우리로 등의 종목을 검출할 수 없음.
// 이건 내가 데이터셋을 가지고 있어야겠다. DB에서 우량주 목록 불러와서 처리하는 방식으로.
export const is우량주 = (ISU_ABBRV: string): Boolean => {
  return ISU_ABBRV.includes('우')
}

export const is사용자제외종목 = async (
  ISU_SRT_CD: string
): Promise<Boolean> => {
  // const 사용자제외종목 = (await api.readAllExcludeStocks()).map(
  //   (stock) => stock.code
  // )
  // if (사용자제외종목.includes(ISU_SRT_CD)) return true
  return false
}

export const 상한가 = (arg: StockInfo[]): StockInfo[] => {
  const filteredStocks = arg.filter((stock) => stock.FLUC_TP_CD === '4')
  return filteredStocks
}

/**
 *
 * 1. 거래량이 1000만 이상 터졌으며
 * 2. 전일 대비 하락하지 않은 종목
 */
export function 거래량1000만이상(arg: StockInfo[]): StockInfo[] {
  const filteredStocks = arg.filter((stock) => {
    const 거래량 = parseInteger(stock.ACC_TRDVOL)
    const 등락률 = parseFloat(stock.FLUC_RT)

    return 거래량 >= 10000000 && 등락률 >= 0
  })

  return filteredStocks
}

/**
 * 1. 당일 평균거래대금이 150억원 이상이며
 * 2. 현재가(종가)는 시가보다 최소 9% 이상 = VI 한번은 걸린 걸 찾고자
 * 3. 전일보다 오늘 고가가 최소 15%는 높은 종목
 * 4. 오늘 고가는 저가보다 15%는 높은 종목
 */
export function 거래대금150억이상(arg: StockInfo[]): StockInfo[] {
  const filteredStocks = arg.filter((stock) => {
    const 거래대금 = parseInteger(stock.ACC_TRDVAL)
    const 종가 = parseInteger(stock.TDD_CLSPRC)
    const 시가 = parseInteger(stock.TDD_OPNPRC)
    const 고가 = parseInteger(stock.TDD_HGPRC)
    const 저가 = parseInteger(stock.TDD_LWPRC)
    const 전일종가 = 종가 - parseInteger(stock.CMPPREVDD_PRC)

    return (
      거래대금 >= 15000000000 &&
      종가 >= 시가 * 1.09 &&
      고가 >= 전일종가 * 1.15 &&
      고가 >= 저가 * 1.15
    )
  })

  return filteredStocks
}

/**
 *
 * 1. 거래량이 250000주 이상이며
 * 2. 전일보다 오늘 종가가 11%는 높은 종목
 */
export function 상한가테마추적(arg: StockInfo[]): StockInfo[] {
  const filteredStocks = arg.filter((stock) => {
    const 거래량 = parseInteger(stock.ACC_TRDVOL)
    const 종가 = parseInteger(stock.TDD_CLSPRC)
    const 전일종가 = 종가 - parseInteger(stock.CMPPREVDD_PRC)

    return 거래량 >= 250000 && 종가 >= 전일종가 * 1.11
  })

  return filteredStocks
}
