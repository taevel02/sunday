// 제외할 종목
export enum excludeStock {
  '스팩주' = '스팩',
  '우선주' = '우',
  '삼성전자' = '삼성전자',
  'KODEX' = 'KODEX',
  'TIGER' = 'TIGER',
  '인버스' = '인버스',
  '레버리지' = '레버리지'
}

const checkStockToExclude = (stockName: string): Boolean =>
  Object.values(excludeStock).some((word) => stockName.includes(word))

export default checkStockToExclude
