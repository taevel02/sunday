import Evernote, { NoteStore } from 'evernote'
import { logger } from '../utils/logger'
import { guid } from '../interface/evernote'

const evernoteClient = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: false // change to false when you are ready to switch to production
})

export class EvernoteService {
  public noteStore = evernoteClient.getNoteStore()
  public userStore = evernoteClient.getUserStore()

  /**
   *
   * @param parentNotebook
   * @param startIndex
   * @param offset
   * @param limit
   * @returns
   */
  public async findAllNotesByNotebook(
    parentNotebook: guid,
    offset: number = 0,
    limit: number = 250
  ) {
    const filter = new NoteStore.NoteFilter()
    filter.notebookGuid = parentNotebook

    const allNotesMetadata = await this.noteStore.findNotesMetadata(
      filter,
      offset,
      limit,
      {
        includeTitle: true,
        includeCreated: true,
        includeUpdated: true
      }
    )

    const totalCount = allNotesMetadata.totalNotes
    const notes = allNotesMetadata.notes
    const hasNext = totalCount - (offset + notes.length) > 0

    return {
      totalCount,
      notes,
      hasNext
    }
  }

  public async makeNote(
    noteTitle: string,
    noteBody?: string,
    parentNotebook?: guid
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
    await this.noteStore
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
