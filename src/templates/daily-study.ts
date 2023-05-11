import soaringTradeVolume from '../api/stock/soaring-trade-volume'
import upperLimit from '../api/stock/upper-limit'

const dailyStudy = async () => {
  const upperLimitData = await upperLimit()
  const soaringTradeVolumeData = await soaringTradeVolume()

  if (!upperLimitData || !soaringTradeVolumeData) return

  const filteredUpperLimitData = [
    ...upperLimitData.kospi,
    ...upperLimitData.kosdaq
  ].filter((item) => item.rateOfChange >= 0)
  const filteredSoaringTradeVolumeData = [
    ...soaringTradeVolumeData.kospi,
    ...soaringTradeVolumeData.kosdaq
  ].filter((item) => item.tradeVolume >= 10000000 && item.rateOfChange >= 0)

  // remove duplicates
  const marketData = filteredUpperLimitData.concat(
    filteredSoaringTradeVolumeData.filter(
      (volumeItem) =>
        !filteredUpperLimitData.some(
          (upperLimitItem) => upperLimitItem.id === volumeItem.id
        )
    )
  )

  let noteBody = ''

  for (const index in marketData) {
    const name = marketData[index].name
    name.replaceAll(/&/g, '&amp;').replaceAll(/\s/g, '&nbsp;')

    const rateOfChange = marketData[index].rateOfChange.toFixed(2)
    const tradeVolume = marketData[index].tradeVolume.toString().slice(0, -3)

    noteBody += `<b><span style="color: rgb(255, 0, 16);" >●${name} (+${rateOfChange}%)(${tradeVolume}K)</span></b><br /><br /><br />`
  }

  return noteBody
}

export default dailyStudy
