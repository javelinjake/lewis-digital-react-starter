import type { VideoStart } from '../start'
import MuxVideo from '@mux/mux-video-react'
import { DEFAULT_FPS } from '../frame'
import { useEffect, useRef } from 'react'
import { readMuxClock } from './read-mux-clock'
import { useVideo } from '../use-video'
import { useVideoGroup } from '../video-context'

export function MuxVideoSurface({
  id,
  playbackId,
  start = null,
  fps = DEFAULT_FPS,
  className,
  metadata,
}: {
  id: string
  playbackId: string
  start?: VideoStart | null
  fps?: number
  className?: string
  metadata?: { video_id?: string, video_title?: string }
}) {
  const { register } = useVideoGroup()
  const videoRef = useRef<HTMLVideoElement>(null)
  const groupMuted = useVideo(state => state.muted)
  const audibleId = useVideo(state => state.audibleId)
  const playbackRate = useVideo(state => state.playbackRate)
  const startedAt = start?.startedAt ?? null
  const timeZone = start?.timeZone ?? null

  useEffect(() => {
    const element = videoRef.current
    if (!element)
      return

    element.playbackRate = playbackRate
  }, [playbackRate, playbackId])

  useEffect(() => {
    const element = videoRef.current
    if (!element)
      return

    const assigned = startedAt && timeZone ? { startedAt, timeZone } : null
    return register({
      id,
      element,
      start: assigned,
      fps,
      readClock: () => readMuxClock(element),
    })
  }, [fps, id, playbackId, register, startedAt, timeZone])

  return (
    <MuxVideo
      ref={videoRef}
      playbackId={playbackId}
      className={className}
      playsInline
      preload="metadata"
      muted={groupMuted || audibleId !== id}
      metadata={metadata}
    />
  )
}
