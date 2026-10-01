import { create } from 'zustand'

interface PlaybackState {
  selectedMomentId: string | null
  loopMoment: boolean
  followPlayback: boolean
  selectMoment: (id: string | null) => void
  setLoopMoment: (value: boolean) => void
  setFollowPlayback: (value: boolean) => void
  clearMoment: () => void
}

export const usePlaybackStore = create<PlaybackState>(set => ({
  selectedMomentId: null,
  loopMoment: false,
  followPlayback: true,
  selectMoment: selectedMomentId => set({ selectedMomentId }),
  setLoopMoment: loopMoment => set({ loopMoment }),
  setFollowPlayback: followPlayback => set({ followPlayback }),
  clearMoment: () => set({ selectedMomentId: null, loopMoment: false }),
}))
