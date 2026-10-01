import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useRouteTitle } from '@/hooks/use-route-title'
import { useAuthStore } from '@/stores/auth.store'

export function RootLayout() {
  useRouteTitle()
  const bootstrap = useAuthStore(state => state.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return <Outlet />
}
