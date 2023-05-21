import Evernote, { NoteStoreClient } from 'evernote'
import { logger } from '../utils/logger'

const evernoteClient = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: false
})

export class EvernoteService {
  public noteStore = evernoteClient.getNoteStore()
  public userStore = evernoteClient.getUserStore()

  public async makeNote(
    noteStore: NoteStoreClient,
    noteTitle: string,
    noteBody?: string,
    parentNotebook?: string
  ) {
    let nBody = '<?xml version="1.0" encoding="UTF-8"?>'
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
    nBody += `<en-note>${noteBody}</en-note>`

    // Create note object
    const ourNote = new Evernote.Types.Note()
    ourNote.title = noteTitle
    ourNote.content = nBody

    // parentNotebook is optional; if omitted, default notebook is used
    if (parentNotebook) {
      ourNote.notebookGuid = parentNotebook
    }

    // Attempt to create note in Evernote account (returns a Promise)
    await noteStore
      .createNote(ourNote)
      .then((note: any) => {
        // Do something with `note`
        logger(`Successfully created, ${note.title}`)
      })
      .catch((error: any) => {
        // Something was wrong with the note data
        // See EDAMErrorCode enumeration for error code explanation
        // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
        console.log(error)
      })
  }
}
