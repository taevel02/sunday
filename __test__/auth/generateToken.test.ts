import { AuthManagement } from '../../src/api'

describe('generateToken', () => {
  it('should have a generate token function', () => {
    expect(typeof AuthManagement.verify).toBe('function')
  })

  it('success generate token', async () => {
    expect(
      await AuthManagement.verify({
        grant_type: 'client_credentials',
        appkey: process.env.KIS_KEY,
        appsecret: process.env.KIS_SECRET
      })
    ).toHaveProperty('code', 200)
  })

  it('fail generate token', async () => {
    expect(
      await AuthManagement.verify({
        grant_type: '',
        appkey: '',
        appsecret: ''
      })
    ).toHaveProperty('code', 403)
  })
})
