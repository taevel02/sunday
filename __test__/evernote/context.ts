import Evernote, { Errors, Types } from 'evernote'
import { guid } from '../../src/interface/evernote'

const evernoteTestClient = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: true
})

export const findAllNotesByNotebook = async (
  parentNotebook: guid,
  offset: number = 0,
  limit: number = 250
) => {
  const filter = new Evernote.NoteStore.NoteFilter()
  filter.notebookGuid = parentNotebook

  const allNotesMetadata = await evernoteTestClient
    .getNoteStore()
    .findNotesMetadata(filter, offset, limit, {
      includeTitle: true,
      includeCreated: true,
      includeUpdated: true
    })
    .catch((error: Errors.EDAMUserException) => {
      throw error
    })

  return allNotesMetadata.totalNotes
}

export const makeNote = async (noteTitle: string, noteBody?: string) => {
  let nBody = '<?xml version="1.0" encoding="UTF-8"?>'
  nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
  nBody += `<en-note>${noteBody}</en-note>`

  const ourNote = new Evernote.Types.Note()
  ourNote.title = noteTitle
  ourNote.content = nBody

  const result = await evernoteTestClient
    .getNoteStore()
    .createNote(ourNote)
    .then((note: Types.Note) => note)
    .catch((error: Errors.EDAMUserException) => {
      throw error
    })

  return result
}
