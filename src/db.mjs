import fetch from 'node-fetch'

export const upperLimit = async () => {
  try {
    const UPPER_LIMIT = await fetch(
      'https://invest.zum.com/api/domestic/ranking?category=UPPER_LIMIT',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }
    ).then((res) => res.json())

    return UPPER_LIMIT
  } catch (e) {
    console.log(e)
  }
}

export const soaringTradeVolume = async () => {
  try {
    const SOARING_TRADE_VOLUME = await fetch(
      'https://invest.zum.com/api/domestic/ranking?category=SOARING_TRADE_VOLUME',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }
    ).then((res) => res.json())

    return SOARING_TRADE_VOLUME
  } catch (e) {
    console.log(e)
  }
}
