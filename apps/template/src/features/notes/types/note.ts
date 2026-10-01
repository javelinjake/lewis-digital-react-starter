export interface Note {
  id: string
  title: string
  body: string
  updatedAt: string
}

export interface CreateNoteInput {
  title: string
  body: string
}
