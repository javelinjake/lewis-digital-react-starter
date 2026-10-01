import type { CreateNoteInput, Note } from '../types/note'

export interface NotesApi {
  list: () => Promise<Note[]>
  read: (id: string) => Promise<Note>
  create: (input: CreateNoteInput) => Promise<Note>
}

export interface MockNotesOptions {
  delayMs?: number
  empty?: boolean
  failWith?: Error
}
