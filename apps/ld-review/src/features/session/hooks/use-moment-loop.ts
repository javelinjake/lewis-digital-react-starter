import type { Moment } from '@/types/session'
import { useVideo } from '@ld/video'
import { useEffect } from 'react'
import { loopRestart } from '../lib/playback'
import { usePlaybackStore } from '../stores/playback.store'

export function useMomentLoop(moments: Moment[]) {
  const currentTime = useVideo(state => state.currentTime)
  const seekTo = useVideo(state => state.seekTo)
  const selectedMomentId = usePlaybackStore(state => state.selectedMomentId)
  const loopMoment = usePlaybackStore(state => state.loopMoment)

  useEffect(() => {
    const selected = moments.find(moment => moment.id === selectedMomentId) ?? null
    const restart = loopRestart(currentTime, selected, loopMoment)
    if (restart != null)
      seekTo(restart)
  }, [currentTime, loopMoment, moments, seekTo, selectedMomentId])
}
