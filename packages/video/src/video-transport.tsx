import type { ReactNode } from 'react'
import { Maximize, Pause, Play, Radio, Redo2, Rewind, SkipBack, SkipForward, Undo2, Volume2, VolumeX, ZoomIn } from 'lucide-react'
import { DEFAULT_FPS } from './frame'
import { PlayerControl } from './player-control'
import { useVideo } from './use-video'

const rates = [0.5, 1, 1.5, 2]

export function VideoTransport({ notes = true }: { notes?: boolean }) {
  const paused = useVideo(state => state.paused)
  const playbackRate = useVideo(state => state.playbackRate)
  const muted = useVideo(state => state.muted)
  const zoomed = useVideo(state => state.zoomed)
  const live = useVideo(state => state.live)
  const atLiveEdge = useVideo(state => state.atLiveEdge)
  const followLive = useVideo(state => state.followLive)
  const displayedFrameTime = useVideo(state => state.displayedFrameTime)
  const originLabel = useVideo(state => state.originLabel)
  const togglePlay = useVideo(state => state.togglePlay)
  const seekBy = useVideo(state => state.seekBy)
  const stepFrame = useVideo(state => state.stepFrame)
  const setPlaybackRate = useVideo(state => state.setPlaybackRate)
  const toggleMuted = useVideo(state => state.toggleMuted)
  const startJog = useVideo(state => state.startJog)
  const stopJog = useVideo(state => state.stopJog)
  const toggleZoomed = useVideo(state => state.toggleZoomed)
  const toggleFullscreen = useVideo(state => state.toggleFullscreen)
  const goLive = useVideo(state => state.goLive)

  const frameCaption = [
    `Frame step seeks by 1/${DEFAULT_FPS}s and corrects once to the presented frame.`,
    'Hold jog to rewind with backward seeks.',
    displayedFrameTime != null ? `Shown at ${displayedFrameTime.toFixed(3)}s.` : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <select
          aria-label="Playback speed"
          value={String(playbackRate)}
          onChange={event => setPlaybackRate(Number(event.target.value))}
          className="h-11 shrink-0 rounded-[var(--radius-control)] border border-border bg-card px-2 text-sm text-foreground"
        >
          {rates.map(rate => (
            <option key={rate} value={String(rate)}>
              {`${rate}×`}
            </option>
          ))}
        </select>
        <ControlGroup>
          <PlayerControl label="Previous frame" onClick={() => stepFrame(-1)}>
            <SkipBack className="size-4" />
          </PlayerControl>
          <PlayerControl label="Next frame" onClick={() => stepFrame(1)}>
            <SkipForward className="size-4" />
          </PlayerControl>
        </ControlGroup>
        <ControlDivider />
        <ControlGroup>
          <PlayerControl label="Back 5 seconds" onClick={() => seekBy(-5)}>
            <Undo2 className="size-4" />
          </PlayerControl>
          <PlayerControl label={paused ? 'Play' : 'Pause'} variant="primary" onClick={togglePlay}>
            {paused ? <Play className="size-5 fill-current" /> : <Pause className="size-5 fill-current" />}
          </PlayerControl>
          <PlayerControl label="Forward 5 seconds" onClick={() => seekBy(5)}>
            <Redo2 className="size-4" />
          </PlayerControl>
        </ControlGroup>
        <ControlDivider />
        <ControlGroup>
          <PlayerControl
            label="Jog backward"
            onPointerDown={startJog}
            onPointerUp={stopJog}
            onPointerLeave={stopJog}
          >
            <Rewind className="size-4" />
          </PlayerControl>
          <PlayerControl label={muted ? 'Unmute' : 'Mute'} onClick={toggleMuted}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </PlayerControl>
        </ControlGroup>
        <ControlDivider />
        <ControlGroup>
          <PlayerControl label={zoomed ? 'Reset zoom' : 'Zoom'} variant={zoomed ? 'active' : 'default'} onClick={toggleZoomed}>
            <ZoomIn className="size-4" />
          </PlayerControl>
          <PlayerControl label="Fullscreen" onClick={toggleFullscreen}>
            <Maximize className="size-4" />
          </PlayerControl>
          {live
            ? (
                <PlayerControl label="Go live" variant={atLiveEdge && followLive ? 'active' : 'default'} onClick={goLive}>
                  <Radio className="size-4" />
                </PlayerControl>
              )
            : null}
        </ControlGroup>
      </div>
      {originLabel ? <p className="text-center text-xs text-muted-foreground">{originLabel}</p> : null}
      {notes ? <p className="text-center text-xs text-muted-foreground">{frameCaption}</p> : null}
    </div>
  )
}

function ControlGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1.5">{children}</div>
}

function ControlDivider() {
  return <span aria-hidden="true" className="h-6 w-px shrink-0 bg-white/30" />
}
