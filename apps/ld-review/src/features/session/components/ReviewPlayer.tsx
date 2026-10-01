import type { VideoStart } from '@ld/video'
import type { ReactNode } from 'react'
import type { Moment } from '@/types/session'
import { VideoPicture, VideoRoot, VideoStage, VideoTransport } from '@ld/video'
import { MuxVideoSurface } from '@ld/video/mux'
import { useMomentLoop } from '../hooks/use-moment-loop'
import { SessionTimeline } from './SessionTimeline'

export type ReviewLayout = 'desktop' | 'shared' | 'mobile'

export function ReviewPlayer({
  playbackId,
  moments,
  start = null,
  layout = 'desktop',
  overlay,
}: {
  playbackId: string
  moments: Moment[]
  start?: VideoStart | null
  layout?: ReviewLayout
  overlay?: ReactNode
}) {
  useMomentLoop(moments)

  return (
    <VideoRoot data-layout={layout} className="group flex flex-col gap-3 fullscreen:bg-black">
      <VideoStage
        root={false}
        className="relative overflow-hidden rounded-[var(--radius-panel)] bg-black group-fullscreen:absolute group-fullscreen:inset-0 group-fullscreen:rounded-none"
      >
        <div className="relative aspect-video group-fullscreen:absolute group-fullscreen:inset-0 group-fullscreen:aspect-auto">
          <VideoPicture>
            <MuxVideoSurface
              id="session"
              playbackId={playbackId}
              start={start}
              className="block size-full object-cover"
              metadata={{
                video_id: 'ld-review-session',
                video_title: 'Batting practice',
              }}
            />
          </VideoPicture>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="pointer-events-auto w-full bg-gradient-to-t from-black/70 to-transparent pt-16 group-fullscreen:pb-16">
            {overlay}
            <SessionTimeline moments={moments} />
          </div>
        </div>
      </VideoStage>
      <div className="group-fullscreen:absolute group-fullscreen:inset-x-0 group-fullscreen:bottom-0 group-fullscreen:z-10 group-fullscreen:bg-gradient-to-t group-fullscreen:from-black/80 group-fullscreen:to-transparent group-fullscreen:px-3 group-fullscreen:pt-6 group-fullscreen:pb-3">
        <VideoTransport notes={false} />
      </div>
    </VideoRoot>
  )
}
