/**
 *
 * @param name 종목명
 * @param changeRate 변동률
 * @param volume 거래량
 * @returns
 */
const StockSymbol = (
  name: string,
  changeRate: string | number,
  volume: string | number
) =>
  `<b><span style="color: rgb(252, 18, 51);" >●${name} (+${changeRate}%)(${volume}K)</span></b>`

export default StockSymbol
