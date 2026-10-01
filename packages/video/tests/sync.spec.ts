import { describe, expect, it } from 'vitest'
import { frameStep } from '../src/frame'
import {
  desiredInstantMs,
  presentedFrameNeedsAnotherSeek,
  sharedDuration,
  sharedMediaTime,
  shouldCorrect,
  targetMediaTime,
} from '../src/sync'

describe('sync', () => {
  it('maps the earliest start to shared time zero', () => {
    const earliest = Date.parse('2026-10-01T14:03:12.040+01:00')
    expect(sharedMediaTime({
      mediaTime: 10,
      startedAtMs: earliest,
      programDateMs: null,
    }, earliest)).toBe(10)
  })

  it('seeks a later camera to the shared instant', () => {
    const earliest = 1_000
    const later = earliest + 2_000
    const instant = desiredInstantMs({
      sharedTime: 10,
      earliestStartedAtMs: earliest,
      masterProgramStartMs: null,
    })
    expect(targetMediaTime({
      mediaTime: 0,
      startedAtMs: later,
      programDateMs: null,
    }, instant, 10)).toBe(8)
  })

  it('aligns live members on program date when both expose one', () => {
    const sharedInstant = 1_000_000
    expect(targetMediaTime({
      mediaTime: 8,
      startedAtMs: 50,
      programDateMs: sharedInstant - 500,
    }, sharedInstant, 10)).toBeCloseTo(8.5)
  })

  it('falls back to the master media time when a member has no clock', () => {
    expect(targetMediaTime({
      mediaTime: 3,
      startedAtMs: null,
      programDateMs: null,
    }, null, 10)).toBe(10)
  })

  it('corrects once a member is more than a frame away', () => {
    expect(shouldCorrect(10, 10.02)).toBe(false)
    expect(shouldCorrect(10, 10.05)).toBe(true)
  })

  it('asks for one more seek when the presented frame is more than half a frame off', () => {
    expect(presentedFrameNeedsAnotherSeek(10, 10 + 0.01)).toBe(false)
    expect(presentedFrameNeedsAnotherSeek(10, 10 + 0.02)).toBe(true)
  })

  it('extends the shared duration by the later camera offset', () => {
    expect(sharedDuration([
      { startedAtMs: 0, duration: 20 },
      { startedAtMs: 2_000, duration: 20 },
    ])).toBe(22)
  })

  it('steps one nominal frame', () => {
    expect(frameStep(1, 1, 10, 30)).toBeCloseTo(1 + 1 / 30)
    expect(frameStep(0, -1, 10, 30)).toBe(0)
  })
})
