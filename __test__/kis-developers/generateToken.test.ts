import { AuthManagement } from '../../src/api'

describe('generateToken', () => {
  it('should have a generate token solution', () => {
    expect(typeof AuthManagement.verify).toBe('function')
  })

  test('generate token', async () => {})
})
