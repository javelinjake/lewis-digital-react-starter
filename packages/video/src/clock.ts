import type { StreamKind } from './live'

export interface MemberClock {
  mediaTime: number
  duration: number
  seekableEnd: number | null
  programDateMs: number | null
  programStartMs: number | null
  liveEdge: number | null
  streamType: StreamKind
}

export function instantFromDate(value: Date | null | undefined) {
  if (!(value instanceof Date))
    return null

  const ms = value.getTime()
  return Number.isFinite(ms) ? ms : null
}

export function readSeekableEnd(element: HTMLMediaElement) {
  const ranges = element.seekable
  if (!ranges || ranges.length === 0)
    return null

  try {
    const end = ranges.end(ranges.length - 1)
    return Number.isFinite(end) ? end : null
  }
  catch {
    return null
  }
}

type MediaWithStartDate = HTMLVideoElement & { getStartDate?: () => Date }

export function readElementClock(element: HTMLVideoElement): MemberClock {
  const media = element as MediaWithStartDate
  const programStartMs = typeof media.getStartDate === 'function'
    ? instantFromDate(media.getStartDate())
    : null
  const seekableEnd = readSeekableEnd(element)
  const mediaTime = element.currentTime || 0
  const streamType: StreamKind = Number.isFinite(element.duration) ? 'on-demand' : 'unknown'

  return {
    mediaTime,
    duration: element.duration,
    seekableEnd,
    programStartMs,
    programDateMs: programStartMs == null ? null : programStartMs + mediaTime * 1000,
    liveEdge: seekableEnd,
    streamType,
  }
}
