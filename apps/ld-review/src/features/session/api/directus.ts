import type { SessionApi } from './types'
import type { MomentRecord, SessionRecord } from '@/schemas/directus-schema'
import type { Moment, MomentType, ReviewSession, SessionAccess } from '@/types/session'
import { readItems } from '@directus/sdk'
import { directusRequest } from '@ld/directus'
import { getDirectusClient } from '@/lib/directus/client'

const momentTypes = new Set<MomentType>(['positive', 'technique', 'timing', 'note'])

function asMomentType(value: string): MomentType {
  return momentTypes.has(value as MomentType) ? value as MomentType : 'note'
}

function asAccess(value: string | null): SessionAccess {
  return value === 'view' ? 'view' : 'coach'
}

function toMoment(record: MomentRecord): Moment {
  return {
    id: record.id,
    title: record.title,
    type: asMomentType(record.type),
    start: record.start_seconds,
    end: record.end_seconds,
    note: record.note ?? '',
  }
}

function toSession(record: SessionRecord, moments: MomentRecord[]): ReviewSession {
  return {
    id: record.id,
    title: record.title,
    dateLabel: record.date_label,
    kind: record.kind,
    duration: record.duration_seconds,
    access: asAccess(record.access),
    moments: moments.map(toMoment),
  }
}

export function createDirectusSessionApi(): SessionApi {
  const directus = getDirectusClient()

  return {
    async read() {
      const sessions = await directusRequest(directus.request(readItems('sessions', {
        fields: ['id', 'title', 'date_label', 'kind', 'duration_seconds', 'access'],
        limit: 1,
      })))
      const session = sessions[0]
      if (!session)
        throw new Error('No session is available to review.')

      const moments = await directusRequest(directus.request(readItems('moments', {
        fields: ['id', 'session', 'title', 'type', 'start_seconds', 'end_seconds', 'note', 'sort'],
        filter: { session: { _eq: session.id } },
        sort: ['sort'],
      })))

      return toSession(session, moments)
    },
  }
}
