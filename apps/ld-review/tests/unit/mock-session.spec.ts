import { describe, expect, it } from 'vitest'
import { createMockSessionApi } from '@/features/session/api/mock'

describe('createMockSessionApi', () => {
  it('returns the batting session and its moments', async () => {
    const api = createMockSessionApi()
    const session = await api.read()

    expect(session.title).toBe('Batting practice')
    expect(session.moments.map(moment => moment.title)).toEqual([
      'Balanced stance',
      'Front-foot position',
      'Head over the ball',
      'Follow-through',
      'Timing the drive',
    ])
  })

  it('can start with no moments', async () => {
    const api = createMockSessionApi({ empty: true })
    const session = await api.read()

    expect(session.moments).toEqual([])
  })

  it('can fail the read', async () => {
    const api = createMockSessionApi({ failWith: new Error('offline') })

    await expect(api.read()).rejects.toThrow('offline')
  })
})
