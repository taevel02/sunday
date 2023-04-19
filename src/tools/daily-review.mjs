import { upperLimit, soaringTradeVolume } from '../db.mjs'

export const dailyReview = async () => {
  const upperLimitData = await upperLimit()
  const soaringTradeVolumeData = await soaringTradeVolume()

  const filteredUpperLimitData = [
    ...upperLimitData.kospi,
    ...upperLimitData.kosdaq
  ].filter((item) => item.rateOfChange >= 0)
  const filteredSoaringTradeVolumeData = [
    ...soaringTradeVolumeData.kospi,
    ...soaringTradeVolumeData.kosdaq
  ].filter((item) => item.tradeVolume >= 10000000 && item.rateOfChange >= 0)

  const marketData = [
    ...new Set([...filteredUpperLimitData, ...filteredSoaringTradeVolumeData])
  ]

  let noteBody = ''

  for (const index in marketData) {
    const name = marketData[index].name
    name.includes('&') && name.replaceAll(/&/g, '&amp')

    const rateOfChange = marketData[index].rateOfChange.toFixed(2)
    const tradeVolume = marketData[index].tradeVolume.toString().slice(0, -3)

    noteBody += `
      <b>
        <span style="--darkmode-color: rgb(255, 146, 153); --lightmode-color: rgb(255, 0, 16);" >
          ●${name} (+${rateOfChange}%)(${tradeVolume}K)
        </span>
      </b>
      <br />
      <br />
    `
  }

  return noteBody
}
