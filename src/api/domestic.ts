import { AxiosError } from 'axios'
import { ServerResponse, ServerResponseCode } from '../interface/api'
import {
  HolidayResponse,
  MarketIndexRequest,
  MarketIndexResponse,
  PSearchResultRequest,
  PSearchResultResponse,
  SearchStockInfoRequest,
  SearchStockInfoResponse,
  TR_ID
} from '../interface/domestic'
import { KIS_API } from '../utils/axios'
import dayjs from 'dayjs'

export class DomesticStockService {
  /**
   *
   * @param date
   * @returns true - 휴장일, false - 휴장일 아님, undefined - 에러
   */
  public async isHoliday(date: Date): Promise<Boolean> {
    try {
      const checkHolidayResults = (
        await KIS_API.get<HolidayResponse>(
          '/uapi/domestic-stock/v1/quotations/chk-holiday',
          {
            params: {
              BASS_DT: dayjs(date).format('YYYYMMDD'),
              CTX_AREA_NK: '',
              CTX_AREA_FK: ''
            },
            headers: {
              tr_id: TR_ID.국내휴장일조회
            }
          }
        )
      ).data

      if (checkHolidayResults.rt_cd !== '0') return undefined

      if (checkHolidayResults.output[0].bzdy_yn === 'N') return true

      return false
    } catch (err) {
      const error = err as AxiosError
      throw error
    }
  }

  public async pSearchResult(
    request: PSearchResultRequest
  ): Promise<ServerResponse<PSearchResultResponse>> {
    try {
      const pSearchResults = (
        await KIS_API.get<PSearchResultResponse>(
          '/uapi/domestic-stock/v1/quotations/psearch-result',
          {
            params: request,
            headers: {
              tr_id: TR_ID.종목조건검색조회
            }
          }
        )
      ).data

      if (pSearchResults === undefined) {
        return {
          code: ServerResponseCode.NOT_FOUND
        }
      }

      return {
        code: ServerResponseCode.OK,
        result: pSearchResults
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status ?? -1
      }
    }
  }

  public async searchStockInfo(
    request: SearchStockInfoRequest
  ): Promise<ServerResponse<SearchStockInfoResponse>> {
    try {
      const searchStockInfoResults = (
        await KIS_API.get<SearchStockInfoResponse>(
          '/uapi/domestic-stock/v1/quotations/search-info',
          { params: request, headers: { tr_id: TR_ID.상품기본조회 } }
        )
      ).data

      if (searchStockInfoResults === undefined) {
        return {
          code: ServerResponseCode.NOT_FOUND
        }
      }

      return {
        code: ServerResponseCode.OK,
        result: searchStockInfoResults
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status ?? -1
      }
    }
  }

  public async getMarketIndex(
    request: MarketIndexRequest
  ): Promise<ServerResponse<MarketIndexResponse>> {
    try {
      const marketIndex = (
        await KIS_API.get<MarketIndexResponse>(
          '/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice',
          { params: request, headers: { tr_id: TR_ID.국내주식업종기간별시세 } }
        )
      ).data

      if (marketIndex == undefined) {
        return {
          code: ServerResponseCode.NOT_FOUND
        }
      }

      return {
        code: ServerResponseCode.OK,
        result: marketIndex
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status ?? -1
      }
    }
  }
}
