import Evernote from 'evernote'
import dotenv from 'dotenv'

dotenv.config()

export const evernoteClient = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: false
})

export const noteStore = evernoteClient.getNoteStore()
export const userStore = evernoteClient.getUserStore()
