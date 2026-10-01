import type { VideoState } from './group'
import { useStore } from 'zustand'
import { useVideoGroup } from './video-context'

export function useVideo<T>(selector: (state: VideoState) => T) {
  const group = useVideoGroup()
  return useStore(group.store, selector)
}
