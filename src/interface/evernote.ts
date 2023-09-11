import { NoteStore } from 'evernote'

export type guid = string

export interface NoteMetadata extends NoteStore.NoteMetadata {}

export enum NOTEBOOK_GUID {
  evening = '241a0219-4915-4708-abd4-94109dc4e352',
  temp = '51ffc554-02fa-9798-7589-95fa32237b98'
}
