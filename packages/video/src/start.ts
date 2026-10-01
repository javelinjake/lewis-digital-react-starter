export interface VideoStart {
  /** ISO-8601 instant of the first frame, with a numeric offset (`Z` or `±HH:MM`). */
  startedAt: string
  /** IANA zone of the recording clock, for example `Europe/London`. */
  timeZone: string
}

const OFFSET = /(?:Z|[+-]\d{2}:\d{2})$/

export function parseVideoStart(start: VideoStart) {
  const startedAt = start.startedAt.trim()
  const timeZone = start.timeZone.trim()
  if (!OFFSET.test(startedAt))
    throw new Error('startedAt must include a numeric offset')

  const instantMs = Date.parse(startedAt)
  if (!Number.isFinite(instantMs))
    throw new Error('startedAt is not a valid instant')

  if (!isIanaTimeZone(timeZone))
    throw new Error('timeZone is not a known IANA zone')

  return { instantMs, timeZone }
}

export function formatVideoStart(start: VideoStart) {
  const { instantMs, timeZone } = parseVideoStart(start)
  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hourCycle: 'h23',
  }).format(new Date(instantMs))
  return `Started ${clock} ${timeZone}`
}

function isIanaTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat('en-GB', { timeZone }).format(0)
    return true
  }
  catch {
    return false
  }
}
