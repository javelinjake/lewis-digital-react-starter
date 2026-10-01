import { Link } from 'react-router'
import { isMockMode } from '@/config/env.config'

export function HomeOverview() {
  const mode = isMockMode() ? 'mock' : 'live'

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Data mode:
        {' '}
        <code>{mode}</code>
      </p>
      <p className="text-sm">
        Notes use one API. Mock mode keeps them in memory. Live mode reads the same notes from Directus.
      </p>
      <Link className="text-sm underline" to="/notes">Open notes</Link>
    </div>
  )
}
