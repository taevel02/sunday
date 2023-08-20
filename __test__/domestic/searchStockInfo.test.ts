import { DomesticStockManagement } from '../../src/api'

describe('searchStockInfo', () => {
  it('should have a searchStockInfo function', async () => {
    expect(typeof DomesticStockManagement.searchStockInfo).toBe('function')
  })

  it('success search stock info', async () => {
    DomesticStockManagement.searchStockInfo = jest.fn().mockResolvedValue({
      code: 200,
      result: {
        output: {
          shtn_pdno: '005930',
          prdt_abrv_name: '삼성전자'
        }
      }
    })

    const fetch = await DomesticStockManagement.searchStockInfo({
      PDNO: '005930',
      PRDT_TYPE_CD: 300
    })

    expect(fetch.code).toBe(200)
    expect(fetch.result.output.shtn_pdno).toBe('005930')
    expect(fetch.result.output.prdt_abrv_name).toBe('삼성전자')
  })
})
