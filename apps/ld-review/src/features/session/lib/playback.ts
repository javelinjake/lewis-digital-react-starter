import type { Moment } from '@/types/session'
import { CANONICAL_DURATION } from '@/types/session'

export function formatClock(seconds: number) {
  const safe = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  const minutes = Math.floor(safe / 60)
  const remain = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`
}

export function scaleMoments(moments: Moment[], mediaDuration: number): Moment[] {
  if (!Number.isFinite(mediaDuration) || mediaDuration <= 0)
    return moments

  const lastEnd = moments.reduce((end, moment) => Math.max(end, moment.end), 0)
  if (mediaDuration >= lastEnd)
    return moments

  const scale = mediaDuration / CANONICAL_DURATION
  const placed = moments.map((moment) => {
    const length = Math.max(0, moment.end - moment.start)
    const start = Math.min(moment.start * scale, mediaDuration)
    const end = Math.min(start + length, mediaDuration)
    return { ...moment, start, end }
  })

  return placed.map((moment, index) => {
    const nextStart = placed[index + 1]?.start
    if (nextStart == null || moment.end <= nextStart)
      return moment

    return { ...moment, end: Math.max(moment.start, nextStart) }
  })
}

const PLAYHEAD_EPSILON = 0.001

export function momentAtTime(moments: Moment[], time: number) {
  return moments.find(moment => time >= moment.start - PLAYHEAD_EPSILON && time < moment.end) ?? null
}

export function loopRestart(time: number, moment: Moment | null, looping: boolean) {
  if (!looping || !moment)
    return null

  if (time >= moment.end - 0.05)
    return moment.start

  return null
}

export function timelineDuration(mediaDuration: number, moments: Moment[]) {
  if (Number.isFinite(mediaDuration) && mediaDuration > 0)
    return mediaDuration

  return moments.reduce((end, moment) => Math.max(end, moment.end), CANONICAL_DURATION)
}
