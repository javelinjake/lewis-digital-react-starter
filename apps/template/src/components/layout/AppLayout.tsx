import { buttonVariants } from '@ld/ui'
import { NavLink, Outlet } from 'react-router'
import { appConfig } from '@/config/app.config'
import { useRouteTitle } from '@/hooks/use-route-title'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/notes', label: 'Notes', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

export function AppLayout() {
  const title = useRouteTitle()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{appConfig.name}</p>
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
          <nav className="flex gap-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => buttonVariants({ variant: isActive ? 'secondary' : 'ghost' })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
