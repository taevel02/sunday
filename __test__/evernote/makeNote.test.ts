import { makeNote } from './context'

describe('makeNote', () => {
  it('should have a make note function', () => {
    expect(typeof makeNote).toBe('function')
  })

  it('success make note', async () => {
    const title = 'test'
    const note = await makeNote(title, 'test')
    expect(note.title).toEqual(title)
  })

  // @todo: error exception test
})
