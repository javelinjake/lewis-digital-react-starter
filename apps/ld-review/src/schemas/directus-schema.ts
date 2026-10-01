export interface SessionRecord {
  id: string
  title: string
  date_label: string
  kind: string
  duration_seconds: number
  access: string | null
}

export interface MomentRecord {
  id: string
  session: string
  title: string
  type: string
  start_seconds: number
  end_seconds: number
  note: string | null
  sort: number | null
}

export interface DirectusSchema {
  sessions: SessionRecord[]
  moments: MomentRecord[]
}
