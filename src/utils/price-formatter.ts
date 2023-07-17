// price는 10000단위로 표시되며,
// 10000단위가 넘어가면 1억, 1조 단위로 표시되도록 합니다.
const getPriceFormatter = (price: number): string => {
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

export default getPriceFormatter
