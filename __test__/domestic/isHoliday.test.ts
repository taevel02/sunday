import { DomesticStockManagement } from '../../src/api'

describe('isHoliday', () => {
  it('should have a isHoliday function', () => {
    expect(typeof DomesticStockManagement.isHoliday).toBe('function')
  })

  it('success check holiday - 20230820', async () => {
    DomesticStockManagement.isHoliday = jest.fn().mockResolvedValue(true)

    const date = new Date('2023-08-20')
    const fetch = await DomesticStockManagement.isHoliday(date)

    expect(fetch).toBe(true)
  })

  it('success check holiday - 20230821', async () => {
    DomesticStockManagement.isHoliday = jest.fn().mockResolvedValue(false)

    const date = new Date('2023-08-21')
    const fetch = await DomesticStockManagement.isHoliday(date)

    expect(fetch).toBe(false)
  })
})
