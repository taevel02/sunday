/**
 * 시가총액을 조, 억 단위로 변환
 */
export const formatMarketCap = (MKTCAP: string): string => {
  const price = parseNumber(MKTCAP)
  const trillion = Math.floor(price / 10000)
  const billion = price % 10000

  if (trillion > 0 && billion > 0) {
    return `${trillion}조 ${billion}억`
  } else if (trillion > 0) {
    return `${trillion}조`
  } else {
    return `${billion}억`
  }
}

/**
 * 거래량을 천 단위로 변환
 */
export const formatTradeVolume = (ACC_TRDVOL: string): string => {
  const volume = parseNumber(ACC_TRDVOL)
  const thousand = volume % 10000

  return `${thousand}K`
}

/**
 * 1,000,000,000 형태의 문자열을 숫자로 변환
 */
export const parseNumber = (str: string): number =>
  parseInt(str.replace(/,/g, ''))
