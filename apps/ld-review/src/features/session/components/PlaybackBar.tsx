import type { Moment } from '@/types/session'
import { useVideo } from '@ld/video'
import { SecondaryAction, StatusBadge } from '@/components/kit'
import { formatClock } from '../lib/playback'
import { usePlaybackStore } from '../stores/playback.store'

export function PlaybackBar({ moments }: { moments: Moment[] }) {
  const seekTo = useVideo(state => state.seekTo)
  const selectedMomentId = usePlaybackStore(state => state.selectedMomentId)
  const loopMoment = usePlaybackStore(state => state.loopMoment)
  const setLoopMoment = usePlaybackStore(state => state.setLoopMoment)
  const clearMoment = usePlaybackStore(state => state.clearMoment)
  const selected = moments.find(moment => moment.id === selectedMomentId) ?? null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-panel)] border border-border bg-card px-3 py-2">
      <StatusBadge
        label={selected ? `Viewing moment · ${formatClock(selected.start)}–${formatClock(selected.end)}` : 'Full session'}
        variant={selected ? 'selected' : 'default'}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={loopMoment}
          aria-label="Loop moment"
          disabled={!selected}
          onClick={() => setLoopMoment(!loopMoment)}
          className="flex items-center gap-2 text-sm text-foreground disabled:text-[var(--text-disabled)]"
        >
          Loop moment
          <span className={`h-7 w-12 rounded-full p-1 ${loopMoment ? 'bg-primary' : 'bg-[var(--surface-disabled)]'}`}>
            <span className={`block size-5 rounded-full bg-white transition-transform ${loopMoment ? 'translate-x-5' : ''}`} />
          </span>
        </button>
        {selected
          ? (
              <SecondaryAction
                label="Back to full session"
                onClick={() => {
                  clearMoment()
                  seekTo(0)
                }}
              />
            )
          : null}
      </div>
    </div>
  )
}
