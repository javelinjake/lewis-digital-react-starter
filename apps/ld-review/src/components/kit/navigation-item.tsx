import type { ReactNode } from 'react'
import { NavLink } from 'react-router'

type NavVariant = 'default' | 'hover' | 'selected' | 'focus'

const look: Record<NavVariant, string> = {
  default: 'text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground',
  hover: 'bg-[var(--surface-hover)] text-foreground',
  selected: 'bg-[var(--surface-hover)] text-primary',
  focus: 'text-foreground ring-2 ring-[var(--selection)]',
}

export function NavigationItem({
  label,
  to,
  variant = 'default',
  icon,
  onClick,
}: {
  label: string
  to?: string
  variant?: NavVariant
  icon?: ReactNode
  onClick?: () => void
}) {
  const className = `flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-control)] px-4 text-sm font-medium ${look[variant]}`

  if (to) {
    return (
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) => `flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-control)] px-4 text-sm font-medium ${isActive ? look.selected : look.default}`}
      >
        {icon}
        {label}
      </NavLink>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {icon}
      {label}
    </button>
  )
}
