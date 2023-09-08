import { findAllNotebooks } from './context'

describe('findAllNotebooks', () => {
  it('should have a findAllNotebooks function', () => {
    expect(typeof findAllNotebooks).toBe('function')
  })

  it('success find all notebooks', async () => {
    const notebooks = await findAllNotebooks()
    expect(typeof notebooks).toBe('number')
  })

  // @todo: error exception test
})
