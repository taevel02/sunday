import { DomesticStockManagement } from '../../src/api'
import stockData from './fixtures/stockData.json'

describe('searchCondition', () => {
  it('should have a searchCondition function', () => {
    expect(typeof DomesticStockManagement.pSearchResult).toBe('function')
  })

  it('success search condition', async () => {
    DomesticStockManagement.pSearchResult = jest.fn().mockResolvedValue({
      code: 200,
      result: {
        output2: stockData
      }
    })

    const fetch = await DomesticStockManagement.pSearchResult({
      user_id: 'taevel02',
      seq: 2
    })

    expect(fetch.code).toBe(200)
    expect(fetch.result.output2[0].code).toBe('012320')
  })
})
