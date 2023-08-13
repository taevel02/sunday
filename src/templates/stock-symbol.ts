/**
 *
 * @todo 거래대금 측정해서 150억봉은 핑크 하이라이트, 500억봉은 주황 하이라이트
 *
 * @param name 종목명
 * @param changeRate 변동률
 * @param volume 거래량
 * @param tradedVolume 거래대금
 * @returns
 */
const StockSymbol = (
  name: string,
  changeRate: string | number,
  volume: string | number,
  tradedVolume?: string | number
) => {
  // const style = `color: rbg(255, 0, 16); ${tradedVolume > })`

  return `<b><span style="color: rgb(252, 18, 51);" >●${name} (+${changeRate}%)(${volume}K)</span></b>`
}

export default StockSymbol
