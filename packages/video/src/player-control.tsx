import type { ReactNode } from 'react'
import { Button } from '@ld/ui'

type PlayerVariant = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'primary'

const look: Record<PlayerVariant, string> = {
  default: 'border border-border bg-card text-foreground hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
  hover: 'border border-[var(--border-hover)] bg-[var(--surface-hover)] text-foreground',
  focus: 'border border-[var(--selection)] bg-card text-foreground ring-2 ring-[var(--selection)]',
  active: 'border border-[var(--selection)] bg-[var(--surface-selected)] text-[var(--selection-text)]',
  disabled: 'border border-border bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
  primary: 'border border-transparent bg-primary text-primary-foreground hover:bg-[var(--action-hover)] active:bg-[var(--action-pressed)]',
}

export function PlayerControl({
  label,
  variant = 'default',
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  children,
}: {
  label: string
  variant?: PlayerVariant
  onClick?: () => void
  onPointerDown?: () => void
  onPointerUp?: () => void
  onPointerLeave?: () => void
  children?: ReactNode
}) {
  return (
    <Button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={variant === 'active'}
      disabled={variant === 'disabled'}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className={`aspect-square size-11 shrink-0 rounded-[var(--radius-control)] p-0 whitespace-normal disabled:opacity-100 ${look[variant]}`}
    >
      {children ?? <span className="px-1 text-center text-[10px] leading-tight">{label}</span>}
    </Button>
  )
}
