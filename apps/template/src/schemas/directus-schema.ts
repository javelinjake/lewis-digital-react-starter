export interface NoteRecord {
  id: string
  title: string
  body: string | null
  date_created: string | null
  date_updated: string | null
}

export interface DirectusSchema {
  notes: NoteRecord[]
}
