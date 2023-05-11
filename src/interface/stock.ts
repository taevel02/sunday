export interface StockInfoStruct {
  id: string
  name: string
  rateOfChange: number
  tradeVolume: number
}

export interface InvestZumApiStruct {
  kospi: StockInfoStruct[]
  kosdaq: StockInfoStruct[]
}
