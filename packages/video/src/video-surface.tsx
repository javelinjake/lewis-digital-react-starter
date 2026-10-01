import type { VideoStart } from './start'
import { DEFAULT_FPS } from './frame'
import { readElementClock } from './clock'
import { useEffect, useRef, useState } from 'react'
import { useVideo } from './use-video'
import { useVideoGroup } from './video-context'

export type MediaSource =
  | { kind: 'url', src: string, mime?: string }
  | { kind: 'file', file: File }

export function VideoSurface({
  id,
  source,
  start = null,
  fps = DEFAULT_FPS,
  className,
}: {
  id: string
  source: MediaSource
  start?: VideoStart | null
  fps?: number
  className?: string
}) {
  const { register } = useVideoGroup()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const groupMuted = useVideo(state => state.muted)
  const audibleId = useVideo(state => state.audibleId)
  const playbackRate = useVideo(state => state.playbackRate)
  const file = source.kind === 'file' ? source.file : null
  const src = source.kind === 'url' ? source.src : objectUrl
  const mime = source.kind === 'url' ? source.mime : (file?.type || undefined)
  const startedAt = start?.startedAt ?? null
  const timeZone = start?.timeZone ?? null

  useEffect(() => {
    if (!file)
      return

    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    const element = videoRef.current
    if (!element)
      return

    element.playbackRate = playbackRate
  }, [playbackRate, src])

  useEffect(() => {
    const element = videoRef.current
    if (!element || !src)
      return

    const assigned = startedAt && timeZone ? { startedAt, timeZone } : null
    return register({
      id,
      element,
      start: assigned,
      fps,
      readClock: () => readElementClock(element),
    })
  }, [fps, id, register, src, startedAt, timeZone])

  return (
    <video
      key={src ?? 'empty'}
      ref={videoRef}
      className={className}
      playsInline
      preload="metadata"
      muted={groupMuted || audibleId !== id}
    >
      {src ? <source src={src} type={mime} /> : null}
    </video>
  )
}
