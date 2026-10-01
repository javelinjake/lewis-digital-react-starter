import type { Note } from '../types/note'
import type { NotesApi } from './types'
import type { NoteRecord } from '@/schemas/directus-schema'
import { createItem, readItem, readItems } from '@directus/sdk'
import { directusRequest } from '@ld/directus'
import { getDirectusClient } from '@/lib/directus/client'

const fields = ['id', 'title', 'body', 'date_created', 'date_updated'] as const

function toNote(record: NoteRecord): Note {
  return {
    id: record.id,
    title: record.title,
    body: record.body ?? '',
    updatedAt: record.date_updated ?? record.date_created ?? new Date().toISOString(),
  }
}

export function createDirectusNotesApi(): NotesApi {
  const directus = getDirectusClient()

  return {
    async list() {
      const records = await directusRequest(directus.request(readItems('notes', {
        fields: [...fields],
        sort: ['-date_updated'],
      })))

      return records.map(record => toNote(record))
    },
    async read(id) {
      const record = await directusRequest(directus.request(readItem('notes', id, {
        fields: [...fields],
      })))

      return toNote(record)
    },
    async create(input) {
      const record = await directusRequest(directus.request(createItem('notes', {
        title: input.title,
        body: input.body,
      })))

      return toNote(record)
    },
  }
}
