import type { Moment } from '@/types/session'
import { describe, expect, it } from 'vitest'
import { loopRestart, momentAtTime, scaleMoments } from '@/features/session/lib/playback'
import { CANONICAL_DURATION } from '@/types/session'

const moments: Moment[] = [
  { id: 'a', title: 'A', type: 'positive', start: 10, end: 20, note: 'A' },
  { id: 'b', title: 'B', type: 'technique', start: 40, end: 50, note: 'B' },
]

describe('playback helpers', () => {
  it('finds the moment that contains the playhead', () => {
    expect(momentAtTime(moments, 12)?.id).toBe('a')
    expect(momentAtTime(moments, 10 - 0.0001)?.id).toBe('a')
    expect(momentAtTime(moments, 20)).toBeNull()
  })

  it('keeps clip length when the demo video is shorter than the session', () => {
    const sessionMoments: Moment[] = [
      { id: 'a', title: 'A', type: 'positive', start: 72, end: 80, note: 'A' },
      { id: 'b', title: 'B', type: 'technique', start: 266, end: 278, note: 'B' },
    ]
    const scaled = scaleMoments(sessionMoments, 134)
    expect(scaled[0]?.start).toBeCloseTo(72 * 134 / CANONICAL_DURATION)
    expect((scaled[0]?.end ?? 0) - (scaled[0]?.start ?? 0)).toBeCloseTo(8)
    expect((scaled[1]?.end ?? 0) - (scaled[1]?.start ?? 0)).toBeCloseTo(12)
  })

  it('shortens a clip so it does not overlap the next moment', () => {
    const scaled = scaleMoments(moments, 11.2)
    expect(scaled[0]?.end).toBeCloseTo(scaled[1]?.start ?? 0)
    expect(scaled[1]?.end).toBeLessThanOrEqual(11.2)
  })

  it('loops back to the in-point', () => {
    expect(loopRestart(19.96, moments[0] ?? null, true)).toBe(10)
    expect(loopRestart(12, moments[0] ?? null, false)).toBeNull()
  })
})
