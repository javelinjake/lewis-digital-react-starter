import type { MomentType, ReviewSession } from '@/types/session'
import { toast } from '@ld/ui'
import { useVideo, VideoProvider } from '@ld/video'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FeedbackPanel, PrimaryAction, SecondaryAction } from '@/components/kit'
import { DEMO_PLAYBACK_ID } from '@/types/session'
import { formatClock, momentAtTime, scaleMoments } from '../lib/playback'
import { useSessionQuery } from '../queries/use-session-query'
import { usePlaybackStore } from '../stores/playback.store'
import { MomentsPanel } from './MomentsPanel'
import { PlaybackBar } from './PlaybackBar'
import { ReviewPlayer } from './ReviewPlayer'

function playbackId() {
  const configured = import.meta.env.VITE_MUX_PLAYBACK_ID?.trim()
  return configured || DEMO_PLAYBACK_ID
}

export function SessionScreen() {
  const session = useSessionQuery()

  if (session.isPending) {
    return <FeedbackPanel variant="loading" />
  }

  if (session.isError || !session.data) {
    return <FeedbackPanel variant="error" title="Could not load the session" body="Refresh the page and try the demo again." />
  }

  return (
    <VideoProvider>
      <SessionBody review={session.data} />
    </VideoProvider>
  )
}

function SessionBody({ review }: { review: ReviewSession }) {
  const duration = useVideo(state => state.duration)
  const currentTime = useVideo(state => state.currentTime)
  const selectedMomentId = usePlaybackStore(state => state.selectedMomentId)
  const [filter, setFilter] = useState<'all' | MomentType>('all')
  const moments = useMemo(
    () => scaleMoments(review.moments, duration),
    [duration, review.moments],
  )
  const selected = moments.find(moment => moment.id === selectedMomentId) ?? null
  const callout = selected ?? momentAtTime(moments, currentTime)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{`Sessions / ${review.title}`}</p>
          <h1 className="text-[32px] leading-10 font-bold tracking-[-0.4px]">{review.title}</h1>
          <p className="text-sm text-muted-foreground">
            {`${review.dateLabel} · ${review.kind} · ${formatClock(duration || review.duration)}`}
          </p>
        </div>
        {review.access === 'coach'
          ? (
              <div className="flex gap-2">
                <SecondaryAction label="Invite" onClick={() => toast('Sharing comes in a later pass.')} />
                <PrimaryAction label="Create moment" onClick={() => toast('Creating a moment comes in a later pass.')}>
                  <Plus className="size-4" />
                </PrimaryAction>
              </div>
            )
          : null}
      </header>
      <div className="grid h-full min-h-0 flex-1 grid-rows-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-3 overflow-auto">
          <ReviewPlayer
            playbackId={playbackId()}
            start={review.start ?? null}
            moments={moments}
            layout="desktop"
            overlay={callout
              ? (
                  <p className="mx-3 mb-2 w-fit rounded-[var(--radius-control)] bg-black/70 px-3 py-2 text-sm text-white">
                    {callout.title}
                    <span className="mt-1 block text-xs text-white/80">
                      {`${formatClock(callout.start)} – ${formatClock(callout.end)}`}
                    </span>
                  </p>
                )
              : null}
          />
          <PlaybackBar moments={moments} />
        </div>
        {moments.length === 0
          ? <FeedbackPanel variant="empty" />
          : <MomentsPanel moments={moments} filter={filter} onFilter={setFilter} />}
      </div>
    </div>
  )
}
