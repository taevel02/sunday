import axios from 'axios'

export const stockinfo = axios.create({
  baseURL: 'https://invest.zum.com/api/domestic',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
