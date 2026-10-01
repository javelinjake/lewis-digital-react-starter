import { Button } from '@ld/ui'
import { useNavigate } from 'react-router'
import { isMockMode } from '@/config/env.config'
import { useTheme } from '@/hooks/use-theme'
import { useAuthStore } from '@/stores/auth.store'

export function SettingsOverview() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Signed in as
        {' '}
        {user?.email}
      </p>
      <p className="text-sm text-muted-foreground">
        Data mode:
        {' '}
        <code>{isMockMode() ? 'mock' : 'live'}</code>
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={toggleTheme}>
          Theme:
          {' '}
          {theme}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void logout().then(() => navigate('/login'))
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  )
}
