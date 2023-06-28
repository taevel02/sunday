import { AxiosError } from 'axios'
import { ServerResponse, ServerResponseCode } from '../interface/api'
import {
  CUSTOMER_TYPE,
  HolidayRequest,
  HolidayResponse,
  PSearchResultRequest,
  PSearchResultResponse,
  StockInfo,
  TR_ID
} from '../interface/domestic'
import { api } from '../utils/axios'

export class DomesticStockService {
  public async checkHoliday(
    request: HolidayRequest
  ): Promise<ServerResponse<HolidayResponse>> {
    try {
      const checkHolidayResults = (
        await api.get<HolidayResponse>(
          '/uapi/domestic-stock/v1/quotations/chk-holiday',
          {
            params: request,
            headers: {
              tr_id: TR_ID.국내휴장일조회,
              custtype: CUSTOMER_TYPE.개인
            }
          }
        )
      ).data

      if (checkHolidayResults === undefined) {
        return {
          code: ServerResponseCode.NOT_FOUND
        }
      }

      return {
        code: ServerResponseCode.OK,
        result: checkHolidayResults
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status ?? -1
      }
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
              tr_id: TR_ID.종목조건검색조회,
              custtype: CUSTOMER_TYPE.개인
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

  /**
   *
   * @todo ETF, ETN 제외
   */
  public async get상천주(): Promise<StockInfo[]> {
    const _거래량1000만 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 1
      })
    ).result
    const _상한가 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 2
      })
    ).result

    const filteredMarketData = _상한가.output2?.concat(
      _거래량1000만.output2.filter(
        (vol) =>
          !_상한가.output2.some((upperLimit) => upperLimit.code === vol.code)
      )
    )

    return filteredMarketData
  }

  public async get1000억봉(): Promise<StockInfo[]> {
    const _1000억봉 = (
      await this.pSearchResult({
        user_id: 'taevel02',
        seq: 0
      })
    ).result

    return _1000억봉.output2
  }
}
