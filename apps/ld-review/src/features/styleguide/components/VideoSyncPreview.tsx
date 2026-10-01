import type { VideoStart } from '@ld/video'
import { formatVideoStart, VideoPicture, VideoProvider, VideoSeekBar, VideoStage, VideoTransport } from '@ld/video'
import { MuxVideoSurface } from '@ld/video/mux'
import { DEMO_PLAYBACK_ID } from '@/types/session'

const angles: Array<{ id: string, playbackId: string, start: VideoStart }> = [
  {
    id: 'side',
    playbackId: DEMO_PLAYBACK_ID,
    start: {
      startedAt: '2026-10-01T14:03:12.040+01:00',
      timeZone: 'Europe/London',
    },
  },
  {
    id: 'end',
    playbackId: DEMO_PLAYBACK_ID,
    start: {
      startedAt: '2026-10-01T14:03:14.040+01:00',
      timeZone: 'Europe/London',
    },
  },
]

const sameRecording = new Set(angles.map(angle => angle.playbackId)).size === 1
const sharedStart = angles[0].start

export function VideoSyncPreview() {
  return (
    <VideoProvider>
      <div className="flex max-w-3xl flex-col gap-3">
        <VideoStage>
          <div className="grid gap-2 p-2 md:grid-cols-2">
            {angles.map(angle => (
              <SyncAngle
                key={angle.id}
                id={angle.id}
                playbackId={angle.playbackId}
                assigned={angle.start}
                start={sameRecording ? sharedStart : angle.start}
              />
            ))}
          </div>
        </VideoStage>
        <VideoTransport />
        <VideoSeekBar label="Synced video position" />
      </div>
    </VideoProvider>
  )
}

function SyncAngle({
  id,
  playbackId,
  assigned,
  start,
}: {
  id: string
  playbackId: string
  assigned: VideoStart
  start: VideoStart
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative aspect-video">
        <VideoPicture>
          <MuxVideoSurface
            id={id}
            playbackId={playbackId}
            start={start}
            className="block size-full object-cover"
            metadata={{
              video_id: id,
              video_title: `Sync ${id}`,
            }}
          />
        </VideoPicture>
      </div>
      <p className="text-xs text-muted-foreground">{formatVideoStart(assigned)}</p>
    </div>
  )
}
