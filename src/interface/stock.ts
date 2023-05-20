export interface StockInfo {
  financeCategory: string
  id: string
  name: string
  updateDateTime: string
  currentPrice: number
  priceChange: number
  rateOfChange: number
  tradeVolume: number
  tradeValue: number
  per: number
  openPrice: number
  highPrice: number
  lowPrice: number
}

export interface DomesticStock {
  kospi: StockInfo[]
  kosdaq: StockInfo[]
}

export interface GlobalStock {
  snp500: StockInfo[]
  dau30: StockInfo[]
  nasdaq: StockInfo[]
}
