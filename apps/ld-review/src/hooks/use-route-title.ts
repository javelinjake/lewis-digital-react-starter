import { useEffect } from 'react'
import { useMatches } from 'react-router'
import { appConfig } from '@/config/app.config'

interface RouteHandle {
  title?: string
}

export function useRouteTitle() {
  const matches = useMatches()
  const title = [...matches].reverse().map(match => (match.handle as RouteHandle | undefined)?.title).find(Boolean)
    ?? appConfig.name

  useEffect(() => {
    document.title = title
  }, [title])

  return title
}
