import { describe, expect, it } from 'vitest'
import { isAtLiveEdge, isLiveClock, liveEdgePosition, shouldCatchLiveEdge } from '../src/live'

describe('live edge', () => {
  it('treats a mux live stream as live', () => {
    expect(isLiveClock({ streamType: 'live', duration: 12, seekableEnd: 12 })).toBe(true)
  })

  it('leaves on-demand video off the live edge', () => {
    expect(isLiveClock({ streamType: 'on-demand', duration: Number.POSITIVE_INFINITY, seekableEnd: 12 })).toBe(false)
  })

  it('treats an infinite unknown stream with a seekable range as live', () => {
    expect(isLiveClock({ streamType: 'unknown', duration: Number.POSITIVE_INFINITY, seekableEnd: 40 })).toBe(true)
    expect(isLiveClock({ streamType: 'unknown', duration: 40, seekableEnd: 40 })).toBe(false)
  })

  it('prefers the mux live edge over the seekable end', () => {
    expect(liveEdgePosition({ liveEdge: 48.5, seekableEnd: 50 })).toBe(48.5)
    expect(liveEdgePosition({ liveEdge: null, seekableEnd: 50 })).toBe(50)
    expect(liveEdgePosition({ liveEdge: 0, seekableEnd: null })).toBeNull()
  })

  it('catches up only once the playhead falls behind the edge', () => {
    expect(isAtLiveEdge(49.9, 50)).toBe(true)
    expect(shouldCatchLiveEdge(49.9, 50)).toBe(false)
    expect(shouldCatchLiveEdge(49, 50)).toBe(true)
  })
})
