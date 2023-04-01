import Evernote from 'evernote'

const developerToken =
  'S=s1:U=96eb1:E=18e92d728b0:C=1873b25fcb0:P=1cd:A=en-devtoken:V=2:H=fa3c32c5b179e7cae12e1f5e78e39e4f'

const client = new Evernote.Client({ token: developerToken, sandbox: true })

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
