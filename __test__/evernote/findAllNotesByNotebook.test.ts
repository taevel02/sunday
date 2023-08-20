import { Errors } from 'evernote'
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

  it('fail find all notes by notebook', async () => {
    expect(async () => {
      await findAllNotesByNotebook(undefined)
    }).rejects.toThrowError(Errors.EDAMUserException)
  })
})
