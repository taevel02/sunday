import axios, { AxiosError, AxiosHeaders } from 'axios'
import axiosRetry from 'axios-retry'

import { logger } from './logger'
import { TelegramBotManagement } from '../api'

export const zumInvestApi = axios.create({
  baseURL: 'https://invest.zum.com/api/domestic',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})

const instance = axios.create({
  baseURL: 'https://openapi.koreainvestment.com:9443'
})

export default instance

export const api = axios.create({
  baseURL: 'https://openapi.koreainvestment.com:9443',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  timeout: 3000
})

axiosRetry(api, {
  retries: 3,
  retryCondition: (error) => {
    logger(`네트워크 요청 불량으로 재시도 중입니다. (에러코드 ${error.code}}`)
    return true
  }
})

function responseErrorHandler(err: Error | AxiosError) {
  let reportMessage = ''
  const axiosError = err as AxiosError

  if (axiosError.isAxiosError) {
    const status = axiosError.response?.status

    if (status === undefined) {
      reportMessage = '네트워크 연결 상태가 불안정합니다.'
    } else if (status >= 500) {
      reportMessage = '네트워크 서버에 예기치 못한 문제가 발생하였습니다.'
    } else if (status >= 400) {
      switch (status) {
        case 400:
          reportMessage = '잘못된 네트워크 요청입니다.'
          break
        case 401:
          reportMessage = '인증 토큰이 유효하지 않습니다.'
          break
        case 404:
          reportMessage = '잘못된 요청입니다.'
          break
        case 405:
          reportMessage = '지원되지 않는 요청 메서드입니다.'
          break
        default:
          reportMessage = '서비스 처리에 알 수 없는 오류가 발생하였습니다.'
      }
    } else {
      reportMessage = '네트워크 연결에 예기치 못한 문제가 발생하였습니다.'
    }
  }

  logger(reportMessage)
  TelegramBotManagement.sendMessage({
    message: reportMessage,
    type: 'error'
  })

  return Promise.reject(err)
}

export function updateHeader(
  key: string | number,
  value?: string | number | boolean | AxiosHeaders | string[]
) {
  if (value) api.defaults.headers.common[key] = value
  else delete api.defaults.headers.common[key]
}

api.interceptors.response.use(
  (res) => res,
  (err: Error | AxiosError) => responseErrorHandler(err)
)
