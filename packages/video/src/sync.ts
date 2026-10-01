import { DEFAULT_FPS } from './frame'

export interface ClockSample {
  mediaTime: number
  startedAtMs: number | null
  programDateMs: number | null
}

export function offsetsFromStarts(starts: Array<{ id: string, startedAtMs: number | null }>) {
  const known = starts.flatMap(item => item.startedAtMs == null ? [] : [item.startedAtMs])
  const earliest = known.length > 0 ? Math.min(...known) : null
  return Object.fromEntries(starts.map(item => [
    item.id,
    earliest == null || item.startedAtMs == null ? 0 : (item.startedAtMs - earliest) / 1000,
  ]))
}

export function memberInstantMs(sample: ClockSample) {
  if (sample.programDateMs != null && Number.isFinite(sample.programDateMs))
    return sample.programDateMs

  if (sample.startedAtMs != null && Number.isFinite(sample.startedAtMs))
    return sample.startedAtMs + sample.mediaTime * 1000

  return null
}

export function sharedMediaTime(sample: ClockSample, earliestStartedAtMs: number | null) {
  const instant = memberInstantMs(sample)
  if (instant != null && earliestStartedAtMs != null)
    return Math.max(0, (instant - earliestStartedAtMs) / 1000)

  return sample.mediaTime
}

export function desiredInstantMs(input: {
  sharedTime: number
  earliestStartedAtMs: number | null
  masterProgramStartMs: number | null
}) {
  if (input.earliestStartedAtMs != null)
    return input.earliestStartedAtMs + input.sharedTime * 1000

  if (input.masterProgramStartMs != null)
    return input.masterProgramStartMs + input.sharedTime * 1000

  return null
}

export function targetMediaTime(member: ClockSample, sharedInstantMs: number | null, masterMediaTime: number) {
  if (sharedInstantMs != null && member.programDateMs != null && Number.isFinite(member.programDateMs))
    return member.mediaTime + (sharedInstantMs - member.programDateMs) / 1000

  if (sharedInstantMs != null && member.startedAtMs != null)
    return (sharedInstantMs - member.startedAtMs) / 1000

  return masterMediaTime
}

export function shouldCorrect(local: number, target: number, fps = DEFAULT_FPS) {
  return Math.abs(local - target) > 1 / fps
}

export function presentedFrameNeedsAnotherSeek(requested: number, presented: number, fps = DEFAULT_FPS) {
  return Math.abs(presented - requested) > 0.5 / fps
}

export function sharedDuration(members: Array<{ startedAtMs: number | null, duration: number }>) {
  const known = members.flatMap(member => member.startedAtMs == null ? [] : [member.startedAtMs])
  const earliest = known.length > 0 ? Math.min(...known) : null
  return members.reduce((max, member) => {
    if (!Number.isFinite(member.duration) || member.duration <= 0)
      return max

    const offset = earliest != null && member.startedAtMs != null
      ? (member.startedAtMs - earliest) / 1000
      : 0
    return Math.max(max, offset + member.duration)
  }, 0)
}
