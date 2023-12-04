import { StockInfo } from '../api/krx'
import { formatTradeVolume } from '../tools/formatter'

/**
 *
 * @param stock StockInfo
 * @returns ex. ●삼성전자 (+0.02%)(10000K)
 */
export const addStockSymbol = (stock: StockInfo) => {
  const rate = Number(stock.FLUC_RT)

  if (rate > 0) {
    return `<b><span style="color: rgb(252, 18, 51);">●${stock.ISU_ABBRV} (+${
      stock.FLUC_RT
    }%)(${formatTradeVolume(stock.ACC_TRDVOL)})</span></b>`
  } else if (rate < 0) {
    return `<b><span style="color: rgb(13, 58, 153);">●${stock.ISU_ABBRV} (${
      stock.FLUC_RT
    }%)(${formatTradeVolume(stock.ACC_TRDVOL)})</span></b>`
  } else {
    return `<b><span>●${stock.ISU_ABBRV} (${formatTradeVolume(
      stock.ACC_TRDVOL
    )})</span></b>`
  }
}
