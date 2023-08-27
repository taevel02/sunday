import { DomesticStockManagement } from '../../src/api'

describe('getMarketIndex', () => {
  it('should have a getMarketIndex function', () => {
    expect(typeof DomesticStockManagement.getMarketIndex).toBe('function')
  })

  it('success get market index - kospi', async () => {
    DomesticStockManagement.getMarketIndex = jest.fn().mockResolvedValue({
      code: 200,
      result: {
        output1: {
          bstp_nmix_prdy_vrss: '2.78',
          prdy_vrss_sign: '2',
          bstp_nmix_prdy_ctrt: '0.11',
          bstp_nmix_prpr: '2642.07'
        }
      }
    })

    const fetch = await DomesticStockManagement.getMarketIndex({
      FID_COND_MRKT_DIV_CODE: 'U',
      FID_INPUT_ISCD: '0001',
      FID_INPUT_DATE_1: '20200101',
      FID_INPUT_DATE_2: '20200101',
      FID_PERIOD_DIV_CODE: 'D'
    })

    expect(fetch.code).toBe(200)
    expect(fetch.result.output1.bstp_nmix_prpr).toBe('2642.07')
  })
})
