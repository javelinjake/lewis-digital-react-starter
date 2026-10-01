import { describe, expect, it } from 'vitest'
import { createMockNotesApi } from '@/features/notes/api/mock'

describe('createMockNotesApi', () => {
  it('returns the seeded note', async () => {
    const api = createMockNotesApi()
    const notes = await api.list()

    expect(notes.map(note => note.title)).toEqual(['Welcome'])
  })

  it('can start empty and then create', async () => {
    const api = createMockNotesApi({ empty: true })

    expect(await api.list()).toEqual([])

    const created = await api.create({ title: 'Standup', body: 'Shipped the starter.' })
    expect(created.title).toBe('Standup')
    expect(await api.read(created.id)).toMatchObject({ body: 'Shipped the starter.' })
  })

  it('can fail reads', async () => {
    const api = createMockNotesApi({ failWith: new Error('offline') })

    await expect(api.list()).rejects.toThrow('offline')
  })
})
