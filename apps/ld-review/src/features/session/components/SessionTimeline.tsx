import type { KeyboardEvent, MouseEvent } from 'react'
import type { Moment } from '@/types/session'
import { useVideo } from '@ld/video'
import { formatClock, timelineDuration } from '../lib/playback'
import { usePlaybackStore } from '../stores/playback.store'

export function SessionTimeline({ moments }: { moments: Moment[] }) {
  const currentTime = useVideo(state => state.currentTime)
  const duration = useVideo(state => state.duration)
  const seekTo = useVideo(state => state.seekTo)
  const selectMoment = usePlaybackStore(state => state.selectMoment)
  const length = timelineDuration(duration, moments)
  const progress = length > 0 ? Math.min(100, (currentTime / length) * 100) : 0

  function seekFromPointer(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    seekTo(ratio * length)
  }

  return (
    <div className="px-3 pb-4">
      <div className="mb-1 flex justify-between text-xs text-white/80">
        <span>{formatClock(currentTime)}</span>
        <span>{formatClock(length)}</span>
      </div>
      <div
        className="relative h-4 cursor-pointer"
        onClick={seekFromPointer}
        role="slider"
        aria-label="Session timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(length)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'ArrowRight')
            seekTo(Math.min(length, currentTime + 5))
          if (event.key === 'ArrowLeft')
            seekTo(Math.max(0, currentTime - 5))
        }}
      >
        <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-white/20" />
        <span className="absolute bottom-0 h-1 rounded-full bg-primary" style={{ width: `${progress}%` }} />
        {moments.map((moment) => {
          const left = length > 0 ? (moment.start / length) * 100 : 0
          return (
            <button
              key={moment.id}
              type="button"
              aria-label={moment.title}
              className="absolute bottom-0.5 size-3 -translate-x-1/2 translate-y-1/2 rounded-full border border-primary bg-primary"
              style={{ left: `${left}%` }}
              onClick={(event) => {
                event.stopPropagation()
                selectMoment(moment.id)
                seekTo(moment.start)
              }}
            />
          )
        })}
        <span className="absolute bottom-0.5 size-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-white" style={{ left: `${progress}%` }} />
      </div>
    </div>
  )
}
