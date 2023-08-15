import { AxiosError } from 'axios'
import { ServerResponse, ServerResponseCode } from '../interface/api'
import {
  HolidayResponse,
  MarketIndex,
  MarketIndexRequest,
  MarketIndexResponse,
  PSearchResultRequest,
  PSearchResultResponse,
  SearchStockInfoRequest,
  SearchStockInfoResponse,
  StockInfo,
  TR_ID
} from '../interface/domestic'
import { api } from '../utils/axios'
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
        await api.get<HolidayResponse>(
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
        await api.get<PSearchResultResponse>(
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
        await api.get<SearchStockInfoResponse>(
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
        await api.get<MarketIndexResponse>(
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

  public async getIndexes(): Promise<{
    kospi: MarketIndex
    kosdaq: MarketIndex
  }> {
    const basedMarketIndexRequest = {
      FID_COND_MRKT_DIV_CODE: 'U',
      FID_INPUT_DATE_1: dayjs(new Date()).format('YYYYMMDD'),
      FID_INPUT_DATE_2: dayjs(new Date()).format('YYYYMMDD'),
      FID_PERIOD_DIV_CODE: 'D'
    }

    const 코스피지수 = (
      await this.getMarketIndex({
        FID_INPUT_ISCD: '0001',
        ...basedMarketIndexRequest
      })
    ).result.output1

    const 코스닥지수 = (
      await this.getMarketIndex({
        FID_INPUT_ISCD: '1001',
        ...basedMarketIndexRequest
      })
    ).result.output1

    return {
      kospi: 코스피지수,
      kosdaq: 코스닥지수
    }
  }

  public async get상천주(): Promise<StockInfo[]> {
    const _거래량1000만 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 1
      })
    )?.result?.output2
    const _상한가 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 2
      })
    )?.result?.output2

    if (_상한가 === undefined) {
      if (_거래량1000만 === undefined) return []
      else return _거래량1000만
    }

    const filteredMarketData = _상한가.concat(
      _거래량1000만.filter(
        (vol) => !_상한가.some((upperLimit) => upperLimit.code === vol.code)
      )
    )

    return filteredMarketData
  }

  // @todo
  public async get1000억봉(): Promise<StockInfo[]> {
    const _1000억봉 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 0
      })
    )?.result?.output2

    if (_1000억봉 === undefined) return []

    return _1000억봉
  }
}
