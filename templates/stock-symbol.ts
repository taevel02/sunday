const StockSymbol = (
  name: string,
  rateOfChange: string | number,
  tradeVolume: string | number
) => {
  return `<b><span style="color: rgb(255, 0, 16);" >●${name} (+${rateOfChange}%)(${tradeVolume}K)</span></b>`
}

export default StockSymbol
