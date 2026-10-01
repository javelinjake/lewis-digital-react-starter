import type { ComponentProps, ReactNode } from 'react'
import { useVideo } from './use-video'
import { useVideoGroup } from './video-context'

export function VideoRoot({ children, className, ...props }: ComponentProps<'div'>) {
  const { stageRef } = useVideoGroup()
  return (
    <div
      {...props}
      ref={(node) => {
        stageRef.current = node
      }}
      className={className}
    >
      {children}
    </div>
  )
}

export function VideoStage({
  children,
  className = 'relative overflow-hidden rounded-[var(--radius-panel)] bg-black',
  root = true,
}: {
  children: ReactNode
  className?: string
  root?: boolean
}) {
  const { stageRef } = useVideoGroup()
  return (
    <div
      ref={root
        ? (node) => {
            stageRef.current = node
          }
        : undefined}
      className={className}
    >
      {children}
    </div>
  )
}

export function VideoPicture({ children }: { children: ReactNode }) {
  const zoomed = useVideo(state => state.zoomed)
  return (
    <div className="absolute inset-0 origin-center" style={{ transform: zoomed ? 'scale(2)' : undefined }}>
      {children}
    </div>
  )
}
