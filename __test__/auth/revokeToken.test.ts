import { AuthManagement } from '../../src/api'

describe('revokeToken', () => {
  let token: string
  beforeAll(async () => {
    AuthManagement.verify = jest.fn().mockResolvedValue({
      code: 200,
      result: {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 86400
      }
    })

    token = (
      await AuthManagement.verify({
        grant_type: 'client_credentials',
        appkey: process.env.KIS_KEY,
        appsecret: process.env.KIS_SECRET
      })
    ).result?.access_token
  })

  it('should have a revoke token function', () => {
    expect(typeof AuthManagement.revoke).toBe('function')
  })

  it('success revoke token', async () => {
    AuthManagement.revoke = jest.fn().mockResolvedValue({
      code: 200
    })

    const fetch = await AuthManagement.revoke({
      appkey: process.env.KIS_KEY,
      appsecret: process.env.KIS_SECRET,
      token
    })

    expect(fetch.code).toBe(200)
  })
})
