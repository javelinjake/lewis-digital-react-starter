import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/auth.store'

function Bootstrapping() {
  return <p className="p-6 text-sm text-muted-foreground">Loading…</p>
}

export function RequireAuth() {
  const status = useAuthStore(state => state.status)

  if (status === 'bootstrapping')
    return <Bootstrapping />

  if (status !== 'authenticated')
    return <Navigate to="/login" replace />

  return <Outlet />
}

export function GuestOnly() {
  const status = useAuthStore(state => state.status)

  if (status === 'bootstrapping')
    return <Bootstrapping />

  if (status === 'authenticated')
    return <Navigate to="/" replace />

  return <Outlet />
}
