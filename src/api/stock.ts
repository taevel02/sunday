import { DomesticStock } from '../interface/stock'
import { zumInvestApi } from './axios'

export class StockService {
  private async getUpperLimit() {
    try {
      const { data } = await zumInvestApi.get<DomesticStock>(
        '/ranking?category=UPPER_LIMIT'
      )

      return data
    } catch (error) {
      console.log(error)
      return
    }
  }

  private async getSoaringTradeVolume() {
    try {
      const { data } = await zumInvestApi.get<DomesticStock>(
        '/ranking?category=SOARING_TRADE_VOLUME'
      )

      return data
    } catch (error) {
      console.log(error)
      return
    }
  }

  private async getNewStock() {
    try {
      const { data } = await zumInvestApi.get<DomesticStock>(
        '/ranking?category=NEW_STOCK'
      )

      return data
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 국내 금일 시장의 상한가 및 거래량을 기준으로 종목을 정리합니다.
   * @param tradeVolumeRange 거래량 범위 지정 (default: [10000000, 999999999])
   * @param rateOfChangeRange 가격변동폭 지정 (default: [0.0, 30.0])
   * @returns
   */
  public async getMarketData(
    tradeVolumeRange: [number, number] = [10000000, 999999999],
    rateOfChangeRange: [number, number] = [0.0, 30.0]
  ) {
    const upperLimit = await this.getUpperLimit()
    const soaringTradeVolume = await this.getSoaringTradeVolume()
    const newStock = await this.getNewStock()

    if (!upperLimit || !soaringTradeVolume || !newStock) return

    const filteredUpperLimit = [...upperLimit.kospi, ...upperLimit.kosdaq]

    const filteredSoaringTradeVolume = [
      ...soaringTradeVolume.kospi,
      ...soaringTradeVolume.kosdaq
    ].filter(
      (item) =>
        tradeVolumeRange[0] <= item.tradeVolume &&
        item.tradeVolume <= tradeVolumeRange[1] &&
        rateOfChangeRange[0] <= item.rateOfChange &&
        item.rateOfChange <= rateOfChangeRange[1]
    )

    // deduplication of filteredUpperLimit and filteredSoaringVolume
    let marketData = filteredUpperLimit.concat(
      filteredSoaringTradeVolume.filter(
        (volumeItem) =>
          !filteredUpperLimit.some(
            (upperLimitItem) => upperLimitItem.id === volumeItem.id
          )
      )
    )

    /**
     *
     * @todo check exactly upper limit
     */
    const filteredNewStock = [...newStock.kospi, ...newStock.kosdaq].filter(
      (item) =>
        (tradeVolumeRange[0] <= item.tradeVolume &&
          item.tradeVolume <= tradeVolumeRange[1] &&
          rateOfChangeRange[0] <= item.rateOfChange &&
          item.rateOfChange <= rateOfChangeRange[1]) ||
        item.rateOfChange > 29.5
    )

    marketData = [...marketData, ...filteredNewStock]

    return marketData
  }
}
