import type { KeyboardEvent, MouseEvent } from 'react'
import { useVideo } from './use-video'

export function VideoSeekBar({ label = 'Video position' }: { label?: string }) {
  const currentTime = useVideo(state => state.currentTime)
  const duration = useVideo(state => state.duration)
  const seekTo = useVideo(state => state.seekTo)
  const seekBy = useVideo(state => state.seekBy)
  const length = Number.isFinite(duration) && duration > 0 ? duration : 0
  const progress = length > 0 ? Math.min(100, (currentTime / length) * 100) : 0

  function seekFromPointer(event: MouseEvent<HTMLDivElement>) {
    if (length <= 0)
      return

    const bounds = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    seekTo(ratio * length)
  }

  function seekFromKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight')
      seekBy(5)
    if (event.key === 'ArrowLeft')
      seekBy(-5)
  }

  return (
    <div
      className="relative h-8 cursor-pointer"
      onClick={seekFromPointer}
      onKeyDown={seekFromKey}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(length)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
    >
      <span className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/20" />
      <span className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
      <span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: `${progress}%` }} />
    </div>
  )
}
