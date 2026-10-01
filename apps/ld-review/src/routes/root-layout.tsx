import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useRouteTitle } from '@/hooks/use-route-title'

export function RootLayout() {
  useRouteTitle()

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return <Outlet />
}
