import type { Note } from '../types/note'
import type { MockNotesOptions, NotesApi } from './types'
import { sleep } from '@ld/utils/async/sleep'

function seed(): Note[] {
  return [{
    id: 'welcome',
    title: 'Welcome',
    body: 'This note comes from the mock API. Directus is not required to run the app.',
    updatedAt: '2026-01-01T09:00:00.000Z',
  }]
}

export function createMockNotesApi(options: MockNotesOptions = {}): NotesApi {
  let notes = options.empty ? [] : seed()
  const delayMs = options.delayMs ?? 0

  async function gate() {
    if (delayMs > 0)
      await sleep(delayMs)

    if (options.failWith)
      throw options.failWith
  }

  return {
    async list() {
      await gate()
      return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    async read(id) {
      await gate()
      const note = notes.find(item => item.id === id)
      if (!note)
        throw Object.assign(new Error('Note not found'), { status: 404 })

      return note
    },
    async create(input) {
      await gate()
      const note: Note = {
        id: crypto.randomUUID(),
        title: input.title,
        body: input.body,
        updatedAt: new Date().toISOString(),
      }
      notes = [note, ...notes]
      return note
    },
  }
}
