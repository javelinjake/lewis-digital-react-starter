import type { VideoStart } from '@ld/video'

export type MomentType = 'positive' | 'technique' | 'timing' | 'note'

export type SessionAccess = 'coach' | 'view'

export interface Moment {
  id: string
  title: string
  type: MomentType
  start: number
  end: number
  note: string
}

export interface ReviewSession {
  id: string
  title: string
  dateLabel: string
  kind: string
  duration: number
  access: SessionAccess
  moments: Moment[]
  start?: VideoStart | null
}

export const CANONICAL_DURATION = 18 * 60 + 40

export const DEMO_PLAYBACK_ID = 'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe'
