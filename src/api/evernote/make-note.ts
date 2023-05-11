import { NoteStoreClient, Types } from 'evernote'

const makeNote = (noteStore: NoteStoreClient, noteTitle?: string, noteBody?: string, parentNotebook?: string) => {
  let nBody = '<?xml version="1.0" encoding="UTF-8"?>'
  nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
  nBody += `<en-note>${noteBody}</en-note>`

  // Create note object
  const ourNote = new Types.Note
  ourNote.title = noteTitle
  ourNote.content = nBody

  // parentNotebook is optional; if omitted, default notebook is used
  if (parentNotebook) {
    ourNote.notebookGuid = parentNotebook
  }

  // Attempt to create note in Evernote account (returns a Promise)
  noteStore
    .createNote(ourNote)
    .then((note: any) => {
      // Do something with `note`
      console.log(`Successfully created, ${note.title}`)
    })
    .catch((error: any) => {
      // Something was wrong with the note data
      // See EDAMErrorCode enumeration for error code explanation
      // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
      console.log(error)
    })
}

export default makeNote
