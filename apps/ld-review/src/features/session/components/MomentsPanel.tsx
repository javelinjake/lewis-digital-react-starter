import type { Moment, MomentType } from '@/types/session'
import { useVideo } from '@ld/video'
import { useEffect } from 'react'
import { MomentCard, SelectField } from '@/components/kit'
import { formatClock, momentAtTime } from '../lib/playback'
import { usePlaybackStore } from '../stores/playback.store'

const filters: Array<{ label: string, value: 'all' | MomentType }> = [
  { label: 'All moments', value: 'all' },
  { label: 'Positive', value: 'positive' },
  { label: 'Technique', value: 'technique' },
  { label: 'Timing', value: 'timing' },
  { label: 'Note', value: 'note' },
]

export function MomentsPanel({
  moments,
  filter,
  onFilter,
}: {
  moments: Moment[]
  filter: 'all' | MomentType
  onFilter: (value: 'all' | MomentType) => void
}) {
  const currentTime = useVideo(state => state.currentTime)
  const seekTo = useVideo(state => state.seekTo)
  const selectedMomentId = usePlaybackStore(state => state.selectedMomentId)
  const followPlayback = usePlaybackStore(state => state.followPlayback)
  const setFollowPlayback = usePlaybackStore(state => state.setFollowPlayback)
  const selectMoment = usePlaybackStore(state => state.selectMoment)
  const loopMoment = usePlaybackStore(state => state.loopMoment)
  const active = momentAtTime(moments, currentTime)
  const visible = moments.filter(moment => filter === 'all' || moment.type === filter)

  useEffect(() => {
    if (loopMoment || !selectedMomentId)
      return

    const selected = moments.find(moment => moment.id === selectedMomentId)
    if (!selected || currentTime < selected.end)
      return

    selectMoment(null)
  }, [currentTime, loopMoment, moments, selectMoment, selectedMomentId])

  useEffect(() => {
    if (!followPlayback || !active)
      return

    document.getElementById(`moment-${active.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, followPlayback])

  return (
    <section id="moments" className="flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{`Moments · ${moments.length}`}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Follow playback
          <button
            type="button"
            role="switch"
            aria-checked={followPlayback}
            aria-label="Follow playback"
            onClick={() => setFollowPlayback(!followPlayback)}
            className={`h-7 w-12 rounded-full p-1 ${followPlayback ? 'bg-primary' : 'bg-[var(--surface-disabled)]'}`}
          >
            <span className={`block size-5 rounded-full bg-white transition-transform ${followPlayback ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>
      <SelectField
        label="Filter"
        value={filters.find(item => item.value === filter)?.label ?? 'All moments'}
        options={filters.map(item => item.label)}
        onChange={(label) => {
          const next = filters.find(item => item.label === label)
          if (next)
            onFilter(next.value)
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pt-2">
        {visible.map((moment) => {
          const atPlayhead = active?.id === moment.id
          const selected = selectedMomentId === moment.id && atPlayhead
          return (
            <div id={`moment-${moment.id}`} key={moment.id}>
              <MomentCard
                title={moment.title}
                type={moment.type}
                meta={`${formatClock(moment.start)} – ${formatClock(moment.end)} · ${Math.round(moment.end - moment.start)} sec`}
                note={moment.note}
                playing={atPlayhead}
                expanded={selected}
                variant={atPlayhead ? 'active' : 'default'}
                onSelect={() => {
                  selectMoment(moment.id)
                  seekTo(moment.start)
                }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
