import { findAllNotesByNotebook } from './context'

describe('findAllNotesByNotebook', () => {
  it('should have a find all notes by notebook function', () => {
    expect(typeof findAllNotesByNotebook).toBe('function')
  })

  it('success find all notes by notebook', async () => {
    const totalNotes = await findAllNotesByNotebook(
      '3663af3a-8fb2-4121-837c-b107016236d9'
    )
    expect(typeof totalNotes).toBe('number')
  })

  // @todo: error exception test
})
