import { describe, expect, it } from 'vitest'
import { formatVideoStart, parseVideoStart } from '../src/start'
import { offsetsFromStarts } from '../src/sync'

const london = { startedAt: '2026-10-01T14:03:12.040+01:00', timeZone: 'Europe/London' }

describe('video start', () => {
  it('reads an absolute instant and its zone', () => {
    expect(parseVideoStart(london)).toEqual({
      instantMs: Date.parse(london.startedAt),
      timeZone: 'Europe/London',
    })
    expect(parseVideoStart({ startedAt: '2026-10-01T13:03:12.040Z', timeZone: 'UTC' }).instantMs)
      .toBe(Date.parse('2026-10-01T13:03:12.040Z'))
  })

  it('rejects a timestamp with no offset', () => {
    expect(() => parseVideoStart({ startedAt: '2026-10-01T14:03:12.040', timeZone: 'Europe/London' }))
      .toThrow(/offset/)
  })

  it('rejects an unknown zone', () => {
    expect(() => parseVideoStart({ startedAt: london.startedAt, timeZone: 'Not/AZone' }))
      .toThrow(/IANA/)
  })

  it('labels the assigned timecode and zone', () => {
    expect(formatVideoStart(london)).toBe('Started 14:03:12.040 Europe/London')
  })

  it('offsets a later camera from the earliest start', () => {
    const first = Date.parse('2026-10-01T14:03:12.040+01:00')
    const later = first + 40
    expect(offsetsFromStarts([
      { id: 'side', startedAtMs: later },
      { id: 'main', startedAtMs: first },
      { id: 'open', startedAtMs: null },
    ])).toEqual({
      side: 0.04,
      main: 0,
      open: 0,
    })
  })
})
