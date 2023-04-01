import Evernote from 'evernote'
import * as dotenv from 'dotenv'
dotenv.config()

const token = process.env.EVERNOTE_TOKEN

const client = new Evernote.Client({
  token,
  sandbox: true,
})

export const noteStore = client.getNoteStore()
export const userStore = client.getUserStore()

export function makeNote(noteStore, noteTitle, noteBody, parentNotebook) {
  let nBody = '<?xml version="1.0" encoding="UTF-8"?>'
  nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
  nBody += `<en-note>${noteBody}</en-note>`

  // Create note object
  let ourNote = new Evernote.Types.Note()
  ourNote.title = noteTitle
  ourNote.content = nBody

  // parentNotebook is optional; if omitted, default notebook is used
  if (parentNotebook && parentNotebook.guid) {
    ourNote.notebookGuid = parentNotebook.guid
  }

  // Attempt to create note in Evernote account (returns a Promise)
  noteStore
    .createNote(ourNote)
    .then((note) => {
      // Do something with `note`
    })
    .catch((error) => {
      // Something was wrong with the note data
      // See EDAMErrorCode enumeration for error code explanation
      // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
      console.log(error)
    })
}
