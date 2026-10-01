import { Bookmark, Clapperboard, Palette, Settings } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavigationItem } from '@/components/kit'

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  function showMoments() {
    if (location.pathname !== '/')
      void navigate('/#moments')
    else
      document.getElementById('moments')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <aside className="flex w-[220px] shrink-0 flex-col justify-between border-r border-border bg-card px-4 py-6">
        <div className="flex flex-col gap-6">
          <p className="px-2 text-lg font-bold">
            <span className="text-primary">LD</span>
            Review
          </p>
          <nav className="flex flex-col gap-1" aria-label="Primary">
            <NavigationItem to="/" label="Sessions" icon={<Clapperboard className="size-4" />} />
            <NavigationItem label="Moments" icon={<Bookmark className="size-4" />} onClick={showMoments} />
            <NavigationItem to="/settings" label="Settings" icon={<Settings className="size-4" />} />
            <NavigationItem to="/styleguide" label="Style guide" icon={<Palette className="size-4" />} />
          </nav>
        </div>
        <p className="border-t border-border pt-4 text-sm">
          <span className="mr-2 inline-flex size-8 items-center justify-center rounded-[10px] bg-primary/20 text-xs font-bold text-primary">CW</span>
          Coach Williams
        </p>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
