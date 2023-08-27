import { AuthManagement } from '../../src/api'

describe('generateToken', () => {
  it('should have a generate token function', () => {
    expect(typeof AuthManagement.verify).toBe('function')
  })

  it('success generate token', async () => {
    AuthManagement.verify = jest.fn().mockResolvedValue({
      code: 200,
      result: {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 86400
      }
    })

    const fetch = await AuthManagement.verify({
      grant_type: 'client_credentials',
      appkey: process.env.KIS_KEY,
      appsecret: process.env.KIS_SECRET
    })

    expect(fetch.code).toBe(200)
    expect(fetch.result.access_token).toBe('token')
  })
})
