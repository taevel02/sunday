import * as Evernote from 'evernote'

const client = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: false
})

export type NoteMetadata = Evernote.NoteStore.NoteMetadata

export const noteStore = client.getNoteStore()
export const userStore = client.getUserStore()

export async function readAllNotebooks(filted?: { stack: string }) {
  console.log('tk1')

  const notebooks = await noteStore.listNotebooks()

  if (!filted) return notebooks

  return notebooks.filter((notebook) => notebook.stack === filted.stack)
}

/**
 *
 * @param parentNotebook
 * @param startIndex
 * @param offset
 * @param limit
 * @returns
 */
export async function readAllNotesByNotebook(
  parentNotebook: string,
  offset: number = 0,
  limit: number = 250
) {
  const filter = new Evernote.NoteStore.NoteFilter()
  filter.notebookGuid = parentNotebook

  const allNotesMetadata = await noteStore.findNotesMetadata(
    filter,
    offset,
    limit,
    {
      includeTitle: true,
      includeCreated: true,
      includeUpdated: true
    }
  )

  const totalCount = allNotesMetadata.totalNotes || 0
  const notes = allNotesMetadata.notes || []
  const hasNext = totalCount - (offset + notes.length) > 0

  return {
    totalCount,
    notes,
    hasNext
  }
}

export async function makeNote(
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
  await noteStore.createNote(ourNote).catch((err) => {
    throw err
  })
}
