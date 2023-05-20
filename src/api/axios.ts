import axios from 'axios'

/**
 *
 * @todo Individually create a custom API and Instance
 */
export const zumInvestApi = axios.create({
  baseURL: 'https://invest.zum.com/api/domestic',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
