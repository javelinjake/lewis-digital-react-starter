import type { StoreApi } from 'zustand'
import type { MemberClock } from './clock'
import type { VideoStart } from './start'
import type { ClockSample } from './sync'
import { clampTime, frameStep } from './frame'
import { isAtLiveEdge, isLiveClock, liveEdgePosition, shouldCatchLiveEdge } from './live'
import { formatVideoStart, parseVideoStart } from './start'
import { desiredInstantMs, presentedFrameNeedsAnotherSeek, sharedDuration, sharedMediaTime, shouldCorrect, targetMediaTime } from './sync'
import { createStore } from 'zustand/vanilla'

export interface VideoState {
  currentTime: number
  duration: number
  paused: boolean
  playbackRate: number
  muted: boolean
  zoomed: boolean
  displayedFrameTime: number | null
  followLive: boolean
  live: boolean
  atLiveEdge: boolean
  audibleId: string | null
  origins: Record<string, VideoStart>
  originLabel: string | null
  seekTo: (time: number) => void
  seekBy: (delta: number) => void
  stepFrame: (direction: 1 | -1) => void
  togglePlay: () => void
  setPlaybackRate: (rate: number) => void
  toggleMuted: () => void
  toggleZoomed: () => void
  toggleFullscreen: () => void
  startJog: () => void
  stopJog: () => void
  goLive: () => void
}

export interface RegisterMember {
  id: string
  element: HTMLVideoElement
  start: VideoStart | null
  fps: number
  readClock: () => MemberClock
}

interface Member extends RegisterMember {
  startedAtMs: number | null
  nudged: boolean
}

export interface VideoGroup {
  store: StoreApi<VideoState>
  stageRef: { current: HTMLDivElement | null }
  register: (input: RegisterMember) => () => void
  startLoop: () => () => void
}

export function createVideoGroup(): VideoGroup {
  const members: Member[] = []
  const stageRef: { current: HTMLDivElement | null } = { current: null }
  let audibleId: string | null = null
  let userLeftLive = false
  let jogTimer: number | null = null

  const store = createStore<VideoState>()(() => ({
    currentTime: 0,
    duration: 0,
    paused: true,
    playbackRate: 1,
    muted: false,
    zoomed: false,
    displayedFrameTime: null,
    followLive: false,
    live: false,
    atLiveEdge: false,
    audibleId: null,
    origins: {},
    originLabel: null,
    seekTo: time => seekMembers(time, true),
    seekBy: (delta) => {
      const state = store.getState()
      seekMembers(clampTime(state.currentTime + delta, state.duration), true)
    },
    stepFrame: (direction) => {
      leaveLive()
      pauseAll()
      const state = store.getState()
      seekMembers(frameStep(state.currentTime, direction, state.duration), true)
    },
    togglePlay: () => {
      const master = pickMaster()
      if (!master)
        return

      if (master.element.paused)
        void playAll()
      else
        pauseAll()
    },
    setPlaybackRate: (rate) => {
      store.setState({ playbackRate: rate })
      for (const member of members)
        member.element.playbackRate = rate
    },
    toggleMuted: () => {
      store.setState(state => ({ muted: !state.muted }))
    },
    toggleZoomed: () => {
      store.setState(state => ({ zoomed: !state.zoomed }))
    },
    toggleFullscreen: () => {
      void toggleFullscreen()
    },
    startJog: () => {
      leaveLive()
      pauseAll()
      stopJog()
      jogTimer = window.setInterval(() => {
        const state = store.getState()
        seekMembers(clampTime(state.currentTime - 0.2, state.duration), true)
      }, 80)
    },
    stopJog,
    goLive: () => {
      const master = pickMaster()
      if (!master)
        return

      const clock = master.readClock()
      const edge = liveEdgePosition(clock)
      if (!isLiveClock(clock) || edge == null)
        return

      userLeftLive = false
      store.setState({ followLive: true, playbackRate: 1 })
      for (const member of members)
        member.element.playbackRate = 1

      seekMembers(sharedFromMedia(master, edge), false)
      void playAll()
    },
  }))

  function leaveLive() {
    userLeftLive = true
    store.setState({ followLive: false })
  }

  function stopJog() {
    if (jogTimer == null)
      return

    window.clearInterval(jogTimer)
    jogTimer = null
  }

  function pickMaster() {
    if (members.length === 0)
      return null

    const dated = members.filter(member => member.startedAtMs != null)
    if (dated.length === 0)
      return members[0] ?? null

    return dated.reduce((earliest, member) =>
      (member.startedAtMs ?? 0) < (earliest.startedAtMs ?? 0) ? member : earliest,
    )
  }

  function earliestStartedAt() {
    const known = members.flatMap(member => member.startedAtMs == null ? [] : [member.startedAtMs])
    return known.length > 0 ? Math.min(...known) : null
  }

  function sampleOf(member: Member, mediaTime = member.readClock().mediaTime): ClockSample {
    const clock = member.readClock()
    return {
      mediaTime,
      startedAtMs: member.startedAtMs,
      programDateMs: mediaTime === clock.mediaTime ? clock.programDateMs : null,
    }
  }

  function sharedFromMedia(member: Member, mediaTime: number) {
    return sharedMediaTime(sampleOf(member, mediaTime), earliestStartedAt())
  }

  function refreshOrigin() {
    const master = pickMaster()
    const origins = Object.fromEntries(
      members.flatMap(member => member.start ? [[member.id, member.start] as const] : []),
    )
    store.setState({
      origins,
      originLabel: master?.start ? formatVideoStart(master.start) : null,
      audibleId,
    })
  }

  function discoverStart(member: Member) {
    if (member.start)
      return

    const programStartMs = member.readClock().programStartMs
    if (programStartMs == null)
      return

    member.startedAtMs = programStartMs
    member.start = {
      startedAt: new Date(programStartMs).toISOString(),
      timeZone: 'UTC',
    }
    refreshOrigin()
  }

  function assignMediaTime(member: Member, mediaTarget: number) {
    member.nudged = false
    member.element.currentTime = mediaTarget
    const element = member.element
    if (typeof element.requestVideoFrameCallback !== 'function') {
      if (pickMaster()?.id === member.id)
        store.setState({ displayedFrameTime: mediaTarget })
      return
    }

    element.requestVideoFrameCallback((_now, metadata) => {
      if (pickMaster()?.id === member.id)
        store.setState({ displayedFrameTime: metadata.mediaTime })

      if (member.nudged)
        return

      if (presentedFrameNeedsAnotherSeek(mediaTarget, metadata.mediaTime, member.fps)) {
        member.nudged = true
        element.currentTime = mediaTarget
      }
    })
  }

  function applyTarget(member: Member, target: number, force: boolean) {
    if (target < 0) {
      member.element.pause()
      if (force || member.element.currentTime > 0)
        assignMediaTime(member, 0)
      return
    }

    const clock = member.readClock()
    const limit = Number.isFinite(clock.duration) && clock.duration > 0
      ? clock.duration
      : (liveEdgePosition(clock) ?? target)
    const mediaTarget = clampTime(target, limit)
    if (force || shouldCorrect(clock.mediaTime, mediaTarget, member.fps))
      assignMediaTime(member, mediaTarget)

    if (!store.getState().paused && member.element.paused)
      playOne(member)
  }

  function seekMembers(sharedTime: number, fromUser: boolean) {
    if (fromUser)
      leaveLive()

    const earliest = earliestStartedAt()
    const master = pickMaster()
    const instant = desiredInstantMs({
      sharedTime,
      earliestStartedAtMs: earliest,
      masterProgramStartMs: master?.readClock().programStartMs ?? null,
    })

    for (const member of members) {
      const clock = member.readClock()
      const target = targetMediaTime(
        { mediaTime: clock.mediaTime, startedAtMs: member.startedAtMs, programDateMs: clock.programDateMs },
        instant,
        sharedTime,
      )
      applyTarget(member, target, true)
    }

    store.setState({ currentTime: Math.max(0, sharedTime) })
  }

  function correctDrift() {
    if (members.length < 2)
      return

    const master = pickMaster()
    if (!master)
      return

    const clock = master.readClock()
    const recordingInstant = desiredInstantMs({
      sharedTime: store.getState().currentTime,
      earliestStartedAtMs: earliestStartedAt(),
      masterProgramStartMs: null,
    })

    for (const member of members) {
      if (member.id === master.id)
        continue

      const other = member.readClock()
      const instant = other.programDateMs != null ? clock.programDateMs : recordingInstant
      const target = targetMediaTime(
        { mediaTime: other.mediaTime, startedAtMs: member.startedAtMs, programDateMs: other.programDateMs },
        instant,
        clock.mediaTime,
      )
      applyTarget(member, target, false)
    }
  }

  function publish() {
    const master = pickMaster()
    if (!master)
      return

    const clock = master.readClock()
    const shared = sharedMediaTime(sampleOf(master), earliestStartedAt())
    const live = members.some(member => isLiveClock(member.readClock()))
    const edge = liveEdgePosition(clock)
    const atLiveEdge = live && edge != null && isAtLiveEdge(clock.mediaTime, edge)
    const duration = live && edge != null
      ? sharedFromMedia(master, edge)
      : sharedDuration(members.map(member => ({
          startedAtMs: member.startedAtMs,
          duration: member.readClock().duration,
        })))

    store.setState({
      currentTime: shared,
      duration,
      live,
      atLiveEdge,
      followLive: live && !userLeftLive ? true : store.getState().followLive,
    })
  }

  function catchLive() {
    if (!store.getState().followLive)
      return

    const master = pickMaster()
    if (!master)
      return

    const clock = master.readClock()
    const edge = liveEdgePosition(clock)
    if (!isLiveClock(clock) || edge == null || !shouldCatchLiveEdge(clock.mediaTime, edge))
      return

    seekMembers(sharedFromMedia(master, edge), false)
  }

  function playOne(member: Member) {
    void member.element.play().catch((error: unknown) => {
      if (error instanceof Error && error.name === 'AbortError')
        return
    })
  }

  function playAll() {
    store.setState({ paused: false })
    for (const member of members) {
      if (member.element.currentTime > 0 || member.startedAtMs == null || member.startedAtMs === earliestStartedAt())
        playOne(member)
    }
  }

  function pauseAll() {
    store.setState({ paused: true })
    for (const member of members)
      member.element.pause()
  }

  async function toggleFullscreen() {
    const stage = stageRef.current
    if (!stage)
      return

    if (document.fullscreenElement)
      await document.exitFullscreen()
    else
      await stage.requestFullscreen()
  }

  function register(input: RegisterMember) {
    const existing = members.findIndex(member => member.id === input.id)
    if (existing >= 0)
      members.splice(existing, 1)

    const member: Member = {
      ...input,
      startedAtMs: null,
      nudged: false,
    }
    if (input.start) {
      member.startedAtMs = parseVideoStart(input.start).instantMs
      member.start = input.start
    }

    members.push(member)
    if (audibleId == null)
      audibleId = member.id

    member.element.playbackRate = store.getState().playbackRate
    const onTime = () => publish()
    const onReady = () => {
      discoverStart(member)
      publish()
      correctDrift()
    }
    const onPlay = () => {
      if (pickMaster()?.id === member.id)
        store.setState({ paused: false })
    }
    const onPause = () => {
      if (pickMaster()?.id === member.id && jogTimer == null)
        store.setState({ paused: true })
    }

    member.element.addEventListener('timeupdate', onTime)
    member.element.addEventListener('loadedmetadata', onReady)
    member.element.addEventListener('durationchange', onReady)
    member.element.addEventListener('progress', publish)
    member.element.addEventListener('play', onPlay)
    member.element.addEventListener('pause', onPause)
    refreshOrigin()
    publish()
    correctDrift()

    return () => {
      member.element.removeEventListener('timeupdate', onTime)
      member.element.removeEventListener('loadedmetadata', onReady)
      member.element.removeEventListener('durationchange', onReady)
      member.element.removeEventListener('progress', publish)
      member.element.removeEventListener('play', onPlay)
      member.element.removeEventListener('pause', onPause)
      const index = members.findIndex(item => item.id === member.id)
      if (index >= 0)
        members.splice(index, 1)

      if (audibleId === member.id)
        audibleId = members[0]?.id ?? null

      refreshOrigin()
      publish()
    }
  }

  function startLoop() {
    const timer = window.setInterval(() => {
      publish()
      catchLive()
      correctDrift()
    }, 250)
    return () => {
      window.clearInterval(timer)
      stopJog()
    }
  }

  return { store, stageRef, register, startLoop }
}
