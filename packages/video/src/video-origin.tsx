import { formatVideoStart } from './start'
import { useVideo } from './use-video'

export function VideoOrigin({ memberId }: { memberId: string }) {
  const start = useVideo(state => state.origins[memberId] ?? null)
  if (!start)
    return null

  return <p className="text-xs text-muted-foreground">{formatVideoStart(start)}</p>
}
