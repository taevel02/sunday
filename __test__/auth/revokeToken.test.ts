import { AuthManagement } from '../../src/api'

describe('revokeToken', () => {
  let token: string
  beforeAll(async () => {
    token = (
      await AuthManagement.verify({
        grant_type: 'client_credentials',
        appkey: process.env.KIS_KEY,
        appsecret: process.env.KIS_SECRET
      })
    ).result?.access_token as string
  })

  it('should have a revoke token function', () => {
    expect(typeof AuthManagement.revoke).toBe('function')
  })

  it('success revoke token', async () => {
    expect(
      await AuthManagement.revoke({
        appkey: process.env.KIS_KEY,
        appsecret: process.env.KIS_SECRET,
        token
      })
    ).toHaveProperty('code', 200)
  })

  it('fail revoke token', async () => {
    expect(
      await AuthManagement.revoke({
        appkey: '',
        appsecret: '',
        token: ''
      })
    ).toHaveProperty('code', 403)
  })

  it('invailed token', async () => {
    expect(
      await AuthManagement.revoke({
        appkey: process.env.KIS_KEY,
        appsecret: process.env.KIS_SECRET,
        token: ''
      })
    ).toHaveProperty('code', 403)
  })
})
