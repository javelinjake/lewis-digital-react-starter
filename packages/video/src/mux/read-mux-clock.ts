import type { StreamKind } from '../live'
import type { MemberClock } from '../clock'
import { getCoreReference, getCurrentPdt, getLiveEdgeStart, getStartDate, getStreamType } from '@mux/playback-core'
import { instantFromDate, readSeekableEnd } from '../clock'

export function readMuxClock(element: HTMLVideoElement): MemberClock {
  const engine = readValue(() => getCoreReference(element)?.engine)
  const reported = readValue(() => getStreamType(element))
  const streamType: StreamKind = reported === 'live' || reported === 'on-demand' ? reported : 'unknown'
  const edge = readNumber(() => getLiveEdgeStart(element))

  return {
    mediaTime: element.currentTime || 0,
    duration: element.duration,
    seekableEnd: readSeekableEnd(element),
    programStartMs: readNumber(() => instantFromDate(getStartDate(element, engine))),
    programDateMs: readNumber(() => instantFromDate(getCurrentPdt(element, engine))),
    liveEdge: edge != null && edge > 0 ? edge : null,
    streamType,
  }
}

function readValue<T>(read: () => T) {
  try {
    return read()
  }
  catch {
    return undefined
  }
}

function readNumber(read: () => number | null) {
  try {
    const value = read()
    return value != null && Number.isFinite(value) ? value : null
  }
  catch {
    return null
  }
}
