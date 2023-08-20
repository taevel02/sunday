import { findAllNotesByNotebook } from './context'
import dumpData from './fixtures/data.json'

describe('findAllNotesByNotebook', () => {
  it('should have a find all notes by notebook function', () => {
    expect(typeof findAllNotesByNotebook).toBe('function')
  })

  it('success find all notes by notebook', async () => {
    const totalNotes = await findAllNotesByNotebook(dumpData.parentNotebook)
    expect(typeof totalNotes).toBe('number')
  })

  // @todo: error exception test
})
