import type { ReactNode } from 'react'
import type { VideoGroup } from './group'
import { createContext, useContext, useEffect, useRef } from 'react'
import { createVideoGroup } from './group'

const VideoContext = createContext<VideoGroup | null>(null)

export function VideoProvider({ children }: { children: ReactNode }) {
  const group = useRef<VideoGroup | null>(null)
  if (group.current == null)
    group.current = createVideoGroup()

  useEffect(() => group.current?.startLoop(), [])

  return (
    <VideoContext.Provider value={group.current}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideoGroup() {
  const group = useContext(VideoContext)
  if (!group)
    throw new Error('useVideo must be used within VideoProvider')

  return group
}
