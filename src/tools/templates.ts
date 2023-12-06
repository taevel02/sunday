import { StockInfo } from '../api/krx'
import { formatTradeVolume } from '../tools/formatter'

/**
 *
 * @param stock StockInfo
 * @returns ex. ●삼성전자 (+0.02%)(10000K)
 */
export const addStockSymbol = (stock: StockInfo) => {
  const name = stock.ISU_ABBRV.replaceAll(/&/g, '&amp;')
  const rate = parseFloat(stock.FLUC_RT)
  const volume = formatTradeVolume(stock.ACC_TRDVOL)

  if (rate > 0) {
    return `<b><span style="color: rgb(252, 18, 51);">●${name} (+${rate}%)(${volume})</span></b>`
  } else if (rate < 0) {
    return `<b><span style="color: rgb(13, 58, 153);">●${name} (${rate}%)($volume})</span></b>`
  } else {
    return `<b><span>●${name} (${volume})</span></b>`
  }
}
