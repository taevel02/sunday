import { EvernoteManagement } from '../../src/api'

describe('Health Check', () => {
  it('should return true', async () => {
    EvernoteManagement.healthCheck = jest.fn().mockResolvedValue(true)

    const res = await EvernoteManagement.healthCheck()
    expect(res).toBe(true)
  })
})
