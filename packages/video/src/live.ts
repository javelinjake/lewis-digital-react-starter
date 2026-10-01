export const LIVE_CATCHUP_SECONDS = 0.25

export type StreamKind = 'live' | 'on-demand' | 'unknown'

export function isLiveClock(clock: {
  streamType: StreamKind
  duration: number
  seekableEnd: number | null
}) {
  if (clock.streamType === 'live')
    return true

  if (clock.streamType === 'on-demand')
    return false

  return !Number.isFinite(clock.duration) && clock.seekableEnd != null && clock.seekableEnd > 0
}

export function liveEdgePosition(clock: {
  liveEdge: number | null
  seekableEnd: number | null
}) {
  if (clock.liveEdge != null && Number.isFinite(clock.liveEdge) && clock.liveEdge > 0)
    return clock.liveEdge

  if (clock.seekableEnd != null && Number.isFinite(clock.seekableEnd) && clock.seekableEnd > 0)
    return clock.seekableEnd

  return null
}

export function isAtLiveEdge(mediaTime: number, edge: number) {
  return edge - mediaTime <= LIVE_CATCHUP_SECONDS
}

export function shouldCatchLiveEdge(mediaTime: number, edge: number) {
  return edge - mediaTime > LIVE_CATCHUP_SECONDS
}
